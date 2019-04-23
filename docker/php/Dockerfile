FROM php:7.3-apache

RUN apt-get update && apt-get -y install sudo
RUN sudo apt-get install -y --no-install-recommends apt-utils \
		build-essential \
		gnupg \
		apt-transport-https \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libzip-dev \
        libpng-dev \
		nano \
		zlib1g-dev \
    && docker-php-ext-install -j$(nproc) iconv \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install -j$(nproc) mbstring pdo pdo_mysql mysqli \
	&& docker-php-ext-install zip

RUN sudo curl -sL https://deb.nodesource.com/setup_10.x | bash \
	&& apt install -y nodejs

RUN sudo a2enmod rewrite