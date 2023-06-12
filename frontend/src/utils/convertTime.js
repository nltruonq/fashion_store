// export const convertTime = (fromDate) => {

//     let CreatedDate = new Date(fromDate)
//     let today = new Date()
//     let requiredDiffrentDays

//     const oneDay = 24 * 60 * 60 * 1000;
//     const diffDays = Math.round(Math.abs((CreatedDate - today) / oneDay));

//     if (diffDays >= 360) {
//         requiredDiffrentDays = Math.floor(diffDays / 360) === 1 ? `${Math.floor(diffDays / 365)} year ago` : `${Math.floor(diffDays / 365)} years ago`
//     } else if (diffDays >= 30) {
//         requiredDiffrentDays = Math.floor(diffDays / 30) === 1 ? `${Math.floor(diffDays / 30)} month ago` : `${Math.floor(diffDays / 30)} months ago`
//     } else if (diffDays < 30) {
//         requiredDiffrentDays = (diffDays === 1 || diffDays === 0) ? `${diffDays} day ago` : `${diffDays} days ago`
//     }

//     return requiredDiffrentDays;
// }

import moment from "moment";
// import "moment/locale/vi";

// const timezone = require("moment-timezone");

export const convertTime = (fromDate) => {
//   fromDate = timezone.tz(fromDate, "Asia/Ho_Chi_Minh");
//   console.log(dateVietNam);
  let requiredDiffrentDays;

  requiredDiffrentDays = moment
    .utc(fromDate)
    .local()
    .startOf("seconds")
    .fromNow();

  return requiredDiffrentDays;
};
