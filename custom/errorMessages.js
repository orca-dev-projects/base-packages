const BAD_INTERNAL_500 = 'Something went wrong';
// export const BAD_CLIENT_REQUEST_400 = 'Bad Request';
// export const BAD_CLIENT_MISSING_USER_400 = 'Bad request, missing user details';
// export const BAD_CLIENT_MISSING_TUTOR_ID_400 =
//   'Bad request, missing/invalid tutor details';
// export const TOKEN_MISSING_400 = 'Token not provided';
// export const TOKEN_EXPIRED_400 = 'Token expired';
// export const TOKEN_ERROR_400 = 'Token is corrupt';
// export const UNABLE_TO_PROCESS_400 = 'Unable to process, Data Mismatch';
const TOKEN_INVALID_401 = 'Token not provided';
// export const ACCESS_403 = 'Forbidden to access';
// export const ACCESS_403_TUTORS_ONLY =
//   'Forbidden to access tutors only resource';
// export const ACCESS_403_PREMIUM_TUTORS_ONLY =
//   'Forbidden to access, premium tutors only resource';
// export const ACCESS_403_STUDENTS_ONLY =
//   'Forbidden to access, students only resource';
// export const ACCESS_403_PARENTS_ONLY =
//   'Forbidden to access, parents only resource';
// export const DUPLICATE_COURSE =
//   'Course Already Exists for this category . Try with a different name';
// export const DUPLICATE_SUBJECT =
//   'Subject Already Exists for this course . Try with a different name';
// export const DUPLICATE_NUMBER =
//   'Number Already Exists. Try with a different Number';
// export const BATCH_DUPLICATE_VIDEO_RESOURCE = 'Video already exists';
// export const BAD_INVALID_CARETAKER_400 = 'Bad request, invalid caretaker';
// export const RAZORPAY_BAD_REQUEST = 'Error making payment. Please try again';
// export const TOO_MANY_REQUESTS = 'Too many requests - try again later';
const SUCCESS_200 = 'success';
const SUCCESS_201 = 'success';
const ERROR_400 = 'Invalid Request';
const ERROR_401 = 'Token not provided';
const ERROR_403 = 'Not allowed';
const ERROR_500 = 'Something went wrong';

exports = module.exports = {
    TOKEN_INVALID_401,
    BAD_INTERNAL_500,
    SUCCESS_200,
    SUCCESS_201,
    ERROR_400,
    ERROR_401,
    ERROR_403,
    ERROR_500
};
