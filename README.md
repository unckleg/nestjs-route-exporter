<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center"><p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
  <a href="https://paypal.com/paypalme/ucnkleg"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/uncklegdev"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Description

Nest route exporter, exports application routes with developer friendly interface for consuming them on FE apps or somewhere else.

## Installation

```bash
$ npm i --save nestjs-route-exporter
```

```bash
$ yarn add nestjs-route-exporter --save
```

## Usage
```javascript
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Generate typescript routes file
  routeExporter(app, 'http://localhost:3001', './routes', 'index.ts'); // Will generate index.ts in root/routes dir

  // Generate js routes file
  routeExporter(app, 'http://localhost:3001', './routes', 'index.js'); // Will generate index.ts in root/routes dir
}

bootstrap();
```

## Support

Nest route exporter is an MIT-licensed open source project. 

## Stay in touch

- Author - [Djordje Stojiljkovic](https://twitter.com/uncklegdev)
- Website - [https://djordjes.com](https://djordjes.com/)
- Twitter - [@uncklegdev](https://twitter.com/uncklegdev)

## License

Nest route exporter is [MIT licensed](LICENSE).