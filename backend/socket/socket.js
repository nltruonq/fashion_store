const Product = require("../models/productModel");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const socketHandle = (io) => {
  let users = [];
  io.on("connection", (socket) => {
    
    socket.on("joinRoom", (id) => {
      const user = { userId: socket.id, room: id };

      const check = users.every((user) => user.userId !== socket.id);

      if (check) {
        users.push(user);
        socket.join(user.room);
      } else {
        users.map((user) => {
          if (user.userId === socket.id) {
            if (user.userId !== id) {
              socket.leave(user.room);
              socket.join(id);
              user.userId = id;
            }
          }
        });
      }
    });

    socket.on("createComment", async (msg) => {
      const {
        rating,
        comment,
        productId,
        user,
        createdAt,
        send,
        name,
        userCommentMain,
      } = msg;
      //send: loại comment (cmt chủ hoặc trả lời)
      //userCommentMain: _id người dùng đang thực thi

      const product = await Product.findById(productId);

      // nếu tạo comment trả lời
      if (send === "replyComment") {
        if (product) {
          product.reviews.forEach((re) => {
            if (re.user.toString() === userCommentMain.toString()) {
              const updatedAt = null;
              re.reply.push({
                id: uuidv4(),
                user,
                name,
                comment,
                createdAt,
                updatedAt,
                reports: [],
                emotions: [],
              });
            }
          });
          await product.save();

          io.to(productId).emit("sendReplyCommentToClient", product.reviews);
        }
      } // nếu tạo comment mới
      else {
        const review = {
          user,
          name: name,
          rating: Number(rating),
          comment,
        };

        // kiểm tra đã comment từ trước hay chưa
        const isReviewed = product.reviews.find(
          (rev) => rev.user.toString() === user.toString()
        );

        if (isReviewed) {
          product.reviews.forEach((rev) => {
            if (rev.user.toString() === user.toString())
              (rev.rating = rating),
                (rev.comment = comment),
                (rev.name = name),
                (rev.updatedAt = Date.now());
          });
        } else {
          product.reviews.push(review);
          product.numOfReviews = product.reviews.length;
        }

        let avg = 0;

        product.reviews.forEach((rev) => {
          avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        await product.save({
          validateBeforeSave: false,
        });
        io.to(productId).emit("sendCommentToClient", product.reviews);
      }
    });

    socket.on("updateComment", async (data) => {
      const {
        type,
        user,
        bossId,
        newComment,
        createdAt,
        productId,
        deleteType,
        reportType,
        reportContent,
        bossItemId,
        emotion,
        uid,
      } = data;
      /*
      type: loại comment (trả lời, cmt chủ)
      user: _id của cmt chủ
      bossId: _id người dùng đang thực thi
      newComment: nội dung comment của user định update
      createdAt: thời gian tạo của comment muốn sửa (dùng để check tìm kiếm)
      productId: _id của sản phẩm đang comment
      deleteType: nếu = 'delete' thì xóa
      reportType: loại comment report (trả lời, cmt chủ)
      reportContent: content của report
      bossItemId: thuộc tính user của cmt chủ hoặc trả lời
      emotion: dislike or like
    */
      const product = await Product.findOne({
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(user) },
        },
      });

      // nếu comment muốn update là loại trả lời
      if (type === "reply") {
        // nếu action là report
        if (product && reportType === "reply" && !emotion) {
          let newReviews = [];
          product.reviews.forEach((rv) => {
            if (rv._id.toString() === user.toString()) {
              rv.reply.forEach((rpl, i) => {
                if (rpl.user.toString() === bossItemId.toString()) {
                  let allUserReport = [];
                  rpl.reports.forEach((rp) => {
                    let check = allUserReport.every(
                      (all) => all !== rp.user.toString()
                    );
                    if (check) {
                      allUserReport.push(rp.user.toString());
                    }
                  });

                  let real = false;
                  if (allUserReport.length >= 3) {
                    real = true;
                  }
                  rpl.reports.push({
                    user: bossId,
                    content: reportContent,
                    real,
                  });
                }
              });
            }
            newReviews.push(rv);
          });

          product.reviews.splice(0);
          newReviews.forEach((rv) => {
            product.reviews.push(rv);
          });

          // remove element which have been report by bossId
          product.reviews.forEach((rv) => {
            rv.reply.forEach((rpl, index) => {
              rpl.reports.forEach((rp, i) => {
                if (rp.user === bossId && rp.real) {
                  rv.reply.splice(index, 1);
                }
              });
            });
          });

          await product.save({
            validateBeforeSave: false,
          });

          io.to(productId).emit("sendUpdateReplyToClient", product.reviews);
        } // nếu action là update
        else if (product && !deleteType && !emotion) {
          product.reviews.forEach((rv) => {
            if (rv._id.toString() === user.toString()) {
              rv.reply.forEach(async (rpl, i) => {
                if (rpl.user === bossId && rpl.createdAt === createdAt) {
                  rv.reply.splice(i, 1);
                  rv.reply.splice(i, 0, {
                    ...rpl,
                    comment: newComment,
                    updatedAt: Date.now(),
                  });
                  await product.save();
                }
              });
            }
          });
          io.to(productId).emit("sendUpdateReplyToClient", product.reviews);
        } // nếu action là delete
        else if (product && deleteType === "delete" && !emotion) {
          product.reviews.forEach((rv) => {
            if (rv._id.toString() === user.toString()) {
              rv.reply.forEach(async (rpl, i) => {
                if (rpl.user === bossId && rpl.createdAt === createdAt) {
                  rv.reply.splice(i, 1);
                  await product.save();
                }
              });
            }
          });
          io.to(productId).emit("sendUpdateReplyToClient", product.reviews);
        } // nếu action là emotion
        else if (product && emotion) {
          let newReviews = [];
          product.reviews.forEach((rv) => {
            if (rv._id.toString() === user.toString()) {
              rv.reply.forEach((rpl) => {
                if (rpl.id === uid) {
                  let check = rpl.emotions.every(
                    (em) => em.user !== bossId 
                  );
                  if (check) {
                    rpl.emotions.push({
                      user: bossId,
                      type: emotion,
                      iden: "child",
                      id: rpl.id,
                    });
                  } else {
                    rpl.emotions.forEach((item, i) => {
                      if (
                        item.user.toString() === bossId.toString() &&
                        item.id === uid &&
                        item.type === emotion
                      ) {
                        rpl.emotions.splice(i, 1);
                      } else if (
                        item.user.toString() === bossId.toString() &&
                        item.id === uid
                      ) {
                        rpl.emotions.splice(i, 1);

                        rpl.emotions.splice(i, 0, {
                          ...item,
                          type: emotion,
                        });
                      }
                    });
                  }
                }
              });
            }
            newReviews.push(rv);
          });

          product.reviews.splice(0);
          newReviews.forEach((rv) => {
            product.reviews.push(rv);
          });

          await product.save({
            validateBeforeSave: false,
          });

          io.to(productId).emit("sendUpdateReplyToClient", product.reviews);
        }
      }
      // nếu comment muốn update là loại cmt chủ
      else {
        // nếu action là report
        if (product && reportType !== "reply" && reportContent && !emotion) {
          let newReviews = [];
          product.reviews.forEach((rv) => {
            let allUserReport = [];
            rv.reports.forEach((rp) => {
              let check = allUserReport.every(
                (all) => all !== rp.user.toString()
              );
              if (check) {
                allUserReport.push(rp.user.toString());
              }
            });

            let real = false;
            if (allUserReport.length >= 3) {
              real = true;
            }

            rv.reports.push({
              user: bossId,
              content: reportContent,
              real,
            });
            newReviews.push(rv);
          });
          product.reviews.splice(0);
          newReviews.forEach((rv) => {
            product.reviews.push(rv);
          });

          product.reviews.forEach((rv) => {
            rv.reply.forEach((rpl, i) => {
              if (rpl.user === bossId && rpl.real) {
                product.reviews.splice(i, 1);
              }
            });
          });

          await product.save({
            validateBeforeSave: false,
          });

          io.to(productId).emit("sendUpdateReplyToClient", product.reviews);
        } // nếu action là update
        else if (product && !deleteType && !emotion) {
          product.reviews.forEach((rv) => {
            if (
              rv._id.toString() === user.toString() &&
              rv.user.toString() === bossId.toString()
            ) {
              rv.comment = newComment.toString();
              rv.updatedAt = Date.now();
            }
          });
          await product.save();
          io.to(productId).emit("sendUpdateReplyToClient", product.reviews);
        } // nếu action là delete
        else if (product && deleteType === "delete" && !emotion) {
          product.reviews.forEach((rv) => {
            if (
              rv._id.toString() === user.toString() &&
              rv.user.toString() == bossId.toString()
            ) {
              let newReviews = product.reviews.filter(
                (rv) =>
                  rv._id.toString() !== user.toString() ||
                  rv.user.toString() !== bossId.toString()
              );
              product.reviews = newReviews;
              let avg = 0;

              newReviews.forEach((rev) => {
                avg += rev.rating;
              });

              let ratings = 0;

              if (newReviews.length === 0) {
                ratings = 0;
              } else {
                ratings = avg / newReviews.length;
              }

              const numOfReviews = newReviews.length;
              product.numOfReviews = numOfReviews;
              product.ratings = ratings;

              product.reviews.reply = [];
              return;
            }
          });
          await product.save();
          io.to(productId).emit("sendUpdateReplyToClient", product.reviews);
        } //nếu action là emotion
        else if (product && emotion) {
          let newReviews = [];
          product.reviews.forEach((rv, i) => {
            if (rv._id.toString() === user.toString()) {
              let check = rv.emotions.every(
                (em) => em.user.toString() !== bossId.toString()
              );
              if (check) {
                rv.emotions.push({
                  user: bossId,
                  type: emotion,
                });
              } else {
                rv.emotions.forEach((item, index) => {
                  if (
                    item.user.toString() === bossId.toString() &&
                    item.type === emotion
                  ) {
                    rv.emotions.splice(index, 1);
                  } else if (item.user.toString() === bossId.toString()) {
                    rv.emotions.splice(index, 1);
                    rv.emotions.splice(index, 0, { ...item, type: emotion });
                  }
                });
              }
            }
            newReviews.push(rv);
          });

          product.reviews.splice(0);
          newReviews.forEach((rv) => {
            product.reviews.push(rv);
          });

          await product.save({
            validateBeforeSave: false,
          });

          io.to(productId).emit("sendUpdateReplyToClient", product.reviews);
        }
      }
    });

  });
};

module.exports = socketHandle;
