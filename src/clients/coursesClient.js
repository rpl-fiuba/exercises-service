const url = require('url');
const fetch = require('node-fetch');
const requestUtils = require('../utils/requestUtils');
const configs = require('../config')();

const coursesServiceUrl = url.format(configs.services.coursesService.url);

const getCourse = async ({ context, params }) => {
  const { courseId, guideId } = params;

  let coursePath;
  if (guideId) {
    coursePath = configs.services.coursesService.paths.guide({ courseId, guideId });
  } else {
    coursePath = configs.services.coursesService.paths.course({ courseId });
  }

  const path = `${coursesServiceUrl}${coursePath}`;

  const response = await fetch(path, {
    headers: {
      Authorization: context.accessToken
    }
  });

  return requestUtils.processResponse(response);
};

module.exports = {
  getCourse
};
