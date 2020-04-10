FROM nginx:1.12.1-alpine

COPY dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
COPY MP_verify_cRqfS51aCqv9dGWC.txt /usr/share/nginx/html
COPY MP_verify_Bxkh9R92NcvSjQ6w.txt /usr/share/nginx/html
COPY MP_verify_gtuiLlMCxnubTXxl.txt /usr/share/nginx/html
