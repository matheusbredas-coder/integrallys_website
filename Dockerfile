FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# O Vite resolve import.meta.env no momento do BUILD e grava o valor dentro do JS. Uma
# variável definida só no runtime do container chega tarde demais e o site sai sem medição
# e com o formulário sem destino — por isso elas entram como build args.
# No Easypanel: Service > Build > Build args.
ARG VITE_GA4_MEASUREMENT_ID
ARG VITE_LEAD_WEBHOOK_URL
ENV VITE_GA4_MEASUREMENT_ID=$VITE_GA4_MEASUREMENT_ID
ENV VITE_LEAD_WEBHOOK_URL=$VITE_LEAD_WEBHOOK_URL

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
