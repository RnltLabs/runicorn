# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Build argument for API key
ARG VITE_GRAPHHOPPER_API_KEY
ENV VITE_GRAPHHOPPER_API_KEY=$VITE_GRAPHHOPPER_API_KEY

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Build arg to bust cache when code changes
ARG GIT_COMMIT=unknown
RUN echo "Building commit: $GIT_COMMIT"

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 3002
EXPOSE 3002

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
