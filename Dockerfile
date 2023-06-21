FROM node:lts-alpine

# install simple http server for serving built content
RUN yarn global add http-server

COPY package.json ./
COPY yarn.lock ./

# install project dependencies
RUN yarn

# copy project files and folders to the current working directory
COPY . .

# build app for production
RUN yarn run build

EXPOSE 5000
CMD [ "http-server", "dist" ]