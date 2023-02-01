// @ts-check
import { join } from "path";
import { appendFile, readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

// @ts-ignore
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
    process.env.NODE_ENV === "production"
        ? `${process.cwd()}/frontend/dist`
        : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
    shopify.config.auth.callbackPath,
    shopify.auth.callback(),
    shopify.redirectToShopifyOrAppRoot()
);
app.post(
    shopify.config.webhooks.path,
    // @ts-ignore
    shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

// all products APIs
app.get("/api/products/count", async (_req, res) => {
    const countData = await shopify.api.rest.Product.count({
        session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
    let status = 200;
    let error = null;

    try {
        await productCreator(res.locals.shopify.session);
    } catch (e) {
        console.log(`Failed to process products/create: ${e.message}`);
        status = 500;
        error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
});

// update product meta title & description
app.put("/api/product/update", async (_req, res) => {
    // console.log("body =>", _req.body);
    try {
        const product = new shopify.api.rest.Product({
            session: res.locals.shopify.session,
        });
        console.log("product session =>", product);
        // adding new data to specific product
        product.id = _req.body.product_id;
        product.metafields_global_title_tag = _req.body.product_title;
        product.metafields_global_description_tag =
            _req.body.product_description;
        // saving product with new data
        await product.save({
            update: true,
        });
        res.status(200).json({
            status: true,
            message: "Product meta data updated",
        });
    } catch (error) {
        console.log("error =>", error);
        // throw error;
        res.status(500).json({
            status: false,
            message: "Failed to update product meta data",
        });
    }
});

// all blogs apis
app.get("/api/blogs/count", async (_req, res) => {
    const countData = await shopify.api.rest.Blog.count({
        session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
});

app.get("/api/blogs/all", async (_req, res) => {
    const countData = await shopify.api.rest.Blog.all({
        session: res.locals.shopify.session,
    });
    // console.log(countData);
    let blogsData = [];
    for (let item of countData) {
        const result = await shopify.api.rest.Article.all({
            session: res.locals.shopify.session,
            blog_id: item.id,
        });
        // console.log(result);
        blogsData.push(...result);
    }
    console.log("blogsData =>", blogsData);
    console.log("blogsData count =>", blogsData.length);

    res.status(200).send(blogsData);
});

app.put("/api/article/update", async (_req, res) => {
    // console.log("body =>", _req.body);
    try {
        const article = new shopify.api.rest.Article({
            session: res.locals.shopify.session,
        });
        console.log("Article session =>", article);
        // adding new data to specific product
        article.blog_id = 241253187;
        article.id = _req.body.product_id;
        article.metafields_global_title_tag = _req.body.product_title;
        article.metafields_global_description_tag =
            _req.body.product_description;
        // saving product with new data
        await article.save({
            update: true,
        });
        res.status(200).json({
            status: true,
            message: "Article meta data updated",
        });
    } catch (error) {
        console.log("error =>", error);
        // throw error;
        res.status(500).json({
            status: false,
            message: "Failed to update Article meta data",
        });
    }
});

// articles
// app.get("/api/article/count", async (_req, res) => {
//     const countData = await shopify.api.rest.Article.count({
//         session: res.locals.shopify.session,
//     });
//     res.status(200).send(countData);
// });

// app.get("/api/article/all", async (_req, res) => {
//     const countData = await shopify.api.rest.Article.all({
//         session: res.locals.shopify.session,
//     });
//     res.status(200).send(countData);
// });

// all page APIs
app.get("/api/pages/all", async (_req, res) => {
    const countData = await shopify.api.rest.Page.all({
        session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
});

app.get("/api/pages/count", async (_req, res) => {
    const countData = await shopify.api.rest.Page.count({
        session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
});

app.put("/api/pages/update", async (_req, res) => {
    console.log("body =>", _req.body);
    try {
        const page = new shopify.api.rest.Page({
            session: res.locals.shopify.session,
        });
        // console.log("page session =>", page);
        // adding new data to specific page
        page.id = _req.body.page_id;
        page.metafields_global_title_tag = _req.body.product_title;
        page.metafields_global_description_tag = _req.body.product_description;
        // saving product with new data
        await page.save({
            update: true,
        });
        res.status(200).json({
            status: true,
            message: "Page meta data updated",
        });
    } catch (error) {
        console.log("error =>", error);
        // throw error;
        res.status(500).json({
            status: false,
            message: "Failed to update page meta data",
        });
    }
});

// all collections APIs
app.get("/api/collection/count", async (_req, res) => {
    const countData = await shopify.api.rest.Collect.count({
        session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
});

app.get("/api/collection/all", async (_req, res) => {
    const countData = await shopify.api.rest.CustomCollection.all({
        session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
});

app.put("/api/collection/update", async (_req, res) => {
    // console.log("body =>", _req.body);
    try {
        const custom_collection = new shopify.api.rest.CustomCollection({
            session: res.locals.shopify.session,
        });
        console.log("collection session =>", custom_collection);
        // adding new data to specific product
        // custom_collection.id = 841564295;
        // custom_collection.metafields = [
        //     {
        //         key: "new",
        //         value: "newvalue",
        //         type: "single_line_text_field",
        //         namespace: "global",
        //     },
        // ];
        custom_collection.id = _req.body.collection_id;
        custom_collection.metafields_global_title_tag =
            "_req.body.product_title";
        custom_collection.metafields_global_description_tag =
            "_req.body.product_description";
        // saving product with new data
        await custom_collection.save({
            update: true,
        });
        res.status(200).json({
            status: true,
            message: "Custom collection meta data updated",
        });
    } catch (error) {
        console.log("error =>", error);
        // throw error;
        res.status(500).json({
            status: false,
            message: "Failed to update custom collection meta data",
        });
    }
});

// add script tag
app.post("/api/script/add", async (_req, res) => {
    // try {
    //     const script_tag = new shopify.api.rest.ScriptTag({
    //         session: res.locals.shopify.session,
    //     });
    //     console.log("script_tag", script_tag);
    //     script_tag.event = "onload";
    //     script_tag.src = "https://nafizanam.com/pd-script.js";
    //     const resultData = await script_tag.save({
    //         update: true,
    //     });
    //     console.log("resultData", resultData);
    //     res.status(200).json({
    //         status: true,
    //         message: "Script added",
    //     });
    // } catch (error) {
    //     console.log("error =>", error);
    //     // throw error;
    //     res.status(500).json({
    //         status: false,
    //         message: "Failed to add script",
    //     });
    // }
});

// get all script list
app.get("/api/script/all", async (_req, res) => {
    const scriptData = await shopify.api.rest.ScriptTag.all({
        session: res.locals.shopify.session,
    });
    console.log(scriptData);
    res.status(200).send(scriptData);
});

// delete a script tag from code
// app.delete("/api/script/delete", async (_req, res) => {
//     const scriptData = await shopify.api.rest.ScriptTag.delete({
//         session: res.locals.shopify.session,
//         id: 223750553895,
//     });
//     console.log(scriptData);
//     res.status(200).send(scriptData);
// });

// get all theme id in array
app.get("/api/theme/all", async (_req, res) => {
    const themeData = await shopify.api.rest.Theme.all({
        session: res.locals.shopify.session,
    });
    // console.log("=>", themeData);
    res.status(200).send(themeData);
});

// get a single page full code by path
app.get("/api/assets/all", async (_req, res) => {
    const themeTemplate = await shopify.api.rest.Asset.all({
        session: res.locals.shopify.session,
        theme_id: 140028215591,
        asset: { key: "sections/main-product.liquid" },
    });
    // console.log("themeTemplate => ", themeTemplate);
    res.status(200).send(themeTemplate);
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
    return res
        .status(200)
        .set("Content-Type", "text/html")
        .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
