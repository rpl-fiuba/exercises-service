const nock = require('nock');
const url = require('url');
const configs = require('../../configs/test');

const usersServiceUrl = url.format(configs.services.usersService.url);
const coursesServiceUrl = url.format(configs.services.coursesService.url);

const mockAuth = ({ status = 200, profile = {}, times = 1 }) => {
  nock(usersServiceUrl)
    .get('/login')
    .times(times)
    .reply(status, profile);
};

const mockGetCourse = ({
  status = 200,
  courseId,
  guideId,
  course = {},
  times = 1
}) => {
  let coursePath;
  if (guideId) {
    coursePath = configs.services.coursesService.paths.guide({ courseId, guideId });
  } else {
    coursePath = configs.services.coursesService.paths.course({ courseId });
  }

  nock(coursesServiceUrl)
    .get(coursePath)
    .times(times)
    .reply(status, course);
};

module.exports = {
  mockAuth,
  mockGetCourse
};
