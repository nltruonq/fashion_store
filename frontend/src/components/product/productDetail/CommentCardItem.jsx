import { useState, useRef } from "react";
import { convertTime } from "../../../utils/convertTime";
import useOutsideAlerter from "../../../utils/refActionShowHide";
import { useParams } from "react-router-dom";

export const CommentCardItem = ({
  children,
  comment,
  bossId,
  socket,
  type,
  cmt,
  setIsShowReport,
}) => {
  const { id } = useParams();
  let timer = "";
  if (comment.createdAt) {
    timer = convertTime(comment.createdAt);
  }


  const editRef = useRef(null);
  const replyRef = useRef(null);
  const listActionRef = useRef(null);
  const editToggleRef = useRef(null);
  const wrapContentRef = useRef(null);
  const dotRef = useRef(null);
  const [newComment, setNewComment] = useState("");

  const handleOnMouseEnter = () => {
    editRef.current.classList.add("show");
  };

  const handleOnMouseLeave = () => {
    editRef.current.classList.remove("show");
  };

  const handleActionShow = () => {
    listActionRef.current.classList.toggle("show");
  };

  const handleShowInputUpdate = () => {
    wrapContentRef.current.classList.add("hide");
    editToggleRef.current.classList.add("show");
    setNewComment(comment.comment + " ");
    replyRef.current.focus();
  };

  const handleHideInputUpdate = () => {
    wrapContentRef.current.classList.remove("hide");
    editToggleRef.current.classList.remove("show");
  };

  const handleUpdate = () => {
    const user = cmt._id;
    if (socket) {
      socket.emit("updateComment", {
        bossId,
        user,
        type,
        newComment,
        createdAt: comment.createdAt,
        productId: id,
      });
      setNewComment("");
      wrapContentRef.current.classList.remove("hide");
      editToggleRef.current.classList.remove("show");
    }
  };

  const handleDeleteUpdate = () => {
    const user = cmt._id;
    const deleteType = "delete";
    if (socket) {
      socket.emit("updateComment", {
        productId: id,
        type,
        deleteType,
        createdAt: comment.createdAt,
        bossId,
        user,
      });
    }
  };

  const check = () => {
    if (type==='reply' && comment.user === bossId  ) {
      return true;
    }
    if(type !== 'reply' && cmt.user == bossId) {
      return true
    }
    return false;
  };

  useOutsideAlerter(listActionRef);

  const handleReportShow = () => {
    setIsShowReport({productId: id, _id: cmt._id, type, bossId, bossItemId: comment.user})
  };

  return (
    <>
      <div
        className="name--avt"
        style={{ flexDirection: "column" }}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <div style={{ display: "flex", width: "100%" }}>
          <div className="name--img--wrap">
            <span>{comment.name.slice(0, 1)}</span>
          </div>
          <div className="wrap--content">
            <div className="wrap--content__comment" ref={wrapContentRef}>
              <h2>
                {comment.name}{" "}
                <span>
                  {timer} {comment.updatedAt ? "(đã chỉnh sửa)" : ""}
                </span>
              </h2>
              <h3>{comment.comment} </h3>
              {children}
              <div
                className="edit__action"
                ref={editRef}
                onClick={handleActionShow}
              >
                <span className="edit__action--span" ref={dotRef}>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </span>
                <ul className="edit__action--list" ref={listActionRef}>
                  {check() ? (
                    <>
                      <li
                        className="edit__action--list-item"
                        onClick={handleShowInputUpdate}
                      >
                        <i className="fa-solid fa-pen"></i> Sửa
                      </li>
                      <li
                        className="edit__action--list-item"
                        onClick={handleDeleteUpdate}
                      >
                        <i className="fa-solid fa-trash"></i> Xóa
                      </li>
                    </>
                  ) : (
                    <>
                      <li
                        className="edit__action--list-item"
                        onClick={handleReportShow}
                      >
                        <i className="fa-solid fa-flag"></i> Báo cáo
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <div ref={editToggleRef} className="wrap--reply-input--edit">
              <input
                ref={replyRef}
                type="text"
                placeholder="Thêm trả lời..."
                value={newComment}
                className="input__update"
                spellCheck={false}
                onChange={(e) => {
                  setNewComment(e.target.value);
                }}
              />
              <div className="wrap--reply-button">
                <button className="btn" onClick={handleHideInputUpdate}>
                  CANCEL
                </button>
                <button className="btn" onClick={handleUpdate}>
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
