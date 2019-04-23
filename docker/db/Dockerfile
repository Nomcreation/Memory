FROM mariadb

ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE memory

COPY ./scripts/CreateTable.sql /docker-entrypoint-initdb.d/CreateTable.sql

EXPOSE 3306