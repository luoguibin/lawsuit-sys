FROM mhart/alpine-node:latest
ENV APP_ROOT ./
WORKDIR ${APP_ROOT}
COPY ./ ${APP_ROOT}
RUN npm install
EXPOSE 8282
CMD npm start
