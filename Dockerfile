FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# O Vite resolve import.meta.env no momento do BUILD e grava o valor dentro do JS. Uma
# variável definida só no runtime do container chega tarde demais e o site sai sem medição
# e com o formulário sem destino — por isso elas entram como build args.
# No Easypanel: aba Environment do serviço (o painel repassa essas variáveis como build args;
# não existe tela de "Build args" nesta versão). Atenção: mudar só uma variável e clicar em
# Deploy NÃO refaz o build — com o mesmo commit o Easypanel reaproveita a imagem antiga. Para
# a variável nova valer, publique um commit novo.
ARG VITE_GA4_MEASUREMENT_ID
ARG VITE_LEAD_WEBHOOK_URL
ARG VITE_META_PIXEL_ID
ENV VITE_GA4_MEASUREMENT_ID=$VITE_GA4_MEASUREMENT_ID
ENV VITE_LEAD_WEBHOOK_URL=$VITE_LEAD_WEBHOOK_URL
ENV VITE_META_PIXEL_ID=$VITE_META_PIXEL_ID

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/vcard.conf /etc/nginx/conf.d/vcard.conf
EXPOSE 80
