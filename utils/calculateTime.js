import moment from "moment";
import Moment from "react-moment";

const calculateTime = (createdAt) => {
  // const today = moment(Date.now());
  // const postDate = moment(createdAt);
  // console.log(today);
  // console.log(postDate);
  const today = moment();
  const yesterday = moment().subtract(1, "day");

  const postDate = createdAt;

  // const diffInHours = today.diff(postDate, "hours");

  if (moment(postDate).isSame(today, "day")) {
    return (
      <>
        Today <Moment format="hh:mm A">{createdAt}</Moment>
      </>
    );
  } else if (moment(postDate).isSame(yesterday, "day")) {
    return (
      <>
        Yesterday <Moment format="hh:mm A">{createdAt}</Moment>
      </>
    );
  } else {
    return (
      <>
        <Moment format="DD/MM/YYYY hh:mm A">{createdAt}</Moment>
      </>
    );
  }
};

export default calculateTime;
