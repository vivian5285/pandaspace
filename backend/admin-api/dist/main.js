"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cors = require("cors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cors());
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Admin API is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map