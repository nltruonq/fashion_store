import React, { useState, useRef, forwardRef, useEffect } from "react";
import useOutsideAlerter from "../../../utils/refActionShowHide";

const REPORT_ARRAY = [
  "Không mong muốn nội dung thương mại hoặc thư rác",
  "Nội dung khiêu dâm hoặc tài liệu khiêu dâm",
  "Lạm dụng trẻ em",
  "Lời nói căm thù hoặc bạo lực bằng hình ảnh",
  "Thúc đẩy khủng bố",
  "Quấy rối hoặc bắt nạt",
  "Tự tử hoặc tự gây thương tích",
  "Thông tin sai lệch",
];
const ReportComent = ({ isShowReport, setIsShowReport, socket }, ref) => {
  const [reports, setReports] = useState("");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const reportArray = REPORT_ARRAY;
  const ovlRef = useRef(null);
  useEffect(() => {
    if (isShowReport) {
      ovlRef.current.classList.add("show");
      ref.current.classList.add("show");
    } else {
      ovlRef.current.classList.remove("show");
      ref.current.classList.remove("show");
    }
  }, [isShowReport]);

  const handleToggleReport = () => {
    setIsShowReport(undefined);
    ref.current.classList.remove("show");
    ovlRef.current.classList.remove("show");
  };


  const handleReport = () => {
    if (isShowReport && socket) {
      let reportType = "";
      if (isShowReport.type === "reply") {
        reportType = "reply";
      }
      const { type, productId, _id, bossId, bossItemId } = isShowReport;
      socket.emit("updateComment", {
        type,
        productId,
        user: _id,
        reportType,
        reportContent: reports,
        bossId,
        bossItemId,
      });
      setIsShowReport(undefined);
    }
  };

  useOutsideAlerter(ref, ovlRef);

  return (
    <div className="wrap--reporting">
      <div ref={ovlRef} className="overlay"></div>
      <div ref={ref} className="reporting">
        <h3>Báo cáo bình luận</h3>
        <ul>
          {reportArray.map((report, i) => (
            <li key={i}>
              <label htmlFor={`report-${i}`}>
                <input
                  onChange={(e) => setReports(e.target.value)}
                  value={report}
                  id={`report-${i}`}
                  type="radio"
                  name="report"
                />
                {report}
              </label>
            </li>
          ))}
        </ul>
        <div className="wrap--reply-button">
          <button className="btn" onClick={handleToggleReport}>
            CANCEL
          </button>
          <button className="btn" onClick={handleReport}>
            REPORT
          </button>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(ReportComent);
