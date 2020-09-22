FROM node:12.16

# Environment

WORKDIR /home/app
ENV NODE_ENV=production

RUN npm i lerna -g --loglevel notice


# Dependencies

COPY package.json /home/app/
COPY lerna.json /home/app/

COPY packages/cli/package.json /home/app/packages/cli/
COPY packages/core/package.json /home/app/packages/core/
COPY packages/editor-ui/package.json /home/app/packages/editor-ui/
COPY packages/node-dev/package.json /home/app/packages/node-dev/
COPY packages/nodes-base/package.json /home/app/packages/nodes-base/
COPY packages/workflow/package.json /home/app/packages/workflow/

# RUN npm ci --ignore-scripts --production --no-optional

# Build

COPY . /home/app/

RUN npx lerna bootstrap --hoist --ignore-scripts -- --production --no-optional

# RUN lerna bootstrap --hoist
RUN npm run build

EXPOSE 5678/tcp
CMD [ "npm" , "run" , "start" ]
