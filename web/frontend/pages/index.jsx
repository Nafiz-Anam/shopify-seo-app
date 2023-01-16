import {
    Card,
    Page,
    Layout,
    TextContainer,
    Image,
    Stack,
    Link,
    Heading,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import { useEffect, useState } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export default function HomePage() {
    const fetch = useAuthenticatedFetch();
    const [added, setAdded] = useState(false);
    // collection api
    const [collectionCount, setCollectionCount] = useState(0);
    const { data: allcollectionData, isLoading: isCloLoading } = useAppQuery({
        url: "/api/script/all",
        reactQueryOptions: {
            onSuccess: () => {
                setPageLoading(false);
            },
        },
    });
    console.log("allscriptData", allcollectionData);

    const [templateData, setTemplateData] = useState("");
    const { data: getTheme, isLoading: themeLoading } = useAppQuery({
        url: "/api/theme/all",
        reactQueryOptions: {
            onSuccess: () => {
                setPageLoading(false);
            },
        },
    });
    console.log("getTheme", getTheme);

    const { data: getTemplateData, isLoading } = useAppQuery({
        url: "/api/assets/all",
        reactQueryOptions: {
            onSuccess: () => {
                setPageLoading(false);
            },
        },
    });
    console.log("getTemplateData", getTemplateData);

    // apply script tag
    const trigger = async () => {
        const method = "POST";
        const response = await fetch("/api/script/add", {
            method,
            body: JSON.stringify({ data: "data" }),
            headers: { "Content-Type": "application/json" },
        });
        console.log("api response => ", response);
    };

    useEffect(() => {
        if (added) {
            trigger();
        }
    }, [added]);

    return (
        <Page narrowWidth>
            <TitleBar title="Add demo products" primaryAction={null} />
            <Layout>
                <Layout.Section>
                    <ProductsCard />
                </Layout.Section>
            </Layout>
        </Page>
    );
}
