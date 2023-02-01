import { TitleBar } from "@shopify/app-bridge-react";
import { Card, Heading, Layout, Page, TextField } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

const codepage = () => {
    const fetch = useAuthenticatedFetch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [codeLoading, setCodeLoading] = useState(true);
    const [code, setCode] = useState("");
    const [descValue, setDescValue] = useState("");

    const { data, isLoading } = useAppQuery({
        url: "/api/assets/all",
        reactQueryOptions: {
            onSuccess: () => {
                setCodeLoading(false);
            },
        },
    });

    useEffect(() => {
        if (!codeLoading) {
            console.log("getTemplateData", data[0].value);
            setCode(data[0].value);
        }
    }, [codeLoading]);

    const handleDescChange = useCallback((value) => setCode(value), []);

    const onSubmit = async (data) => {
        console.log(data);
    };
    return (
        <Page
            fullWidth
            breadcrumbs={[{ content: "Products", url: "/products" }]}
            title="Edit Code"
        >
            <TitleBar disabled />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Layout>
                    <Layout.Section>
                        <Card sectioned>
                            <div style={{ marginTop: "10px" }}>
                                <TextField
                                    value={code}
                                    onChange={handleDescChange}
                                    multiline={100}
                                    autoComplete="off"
                                    showCharacterCount
                                    label="Code"
                                />
                            </div>
                        </Card>
                    </Layout.Section>
                </Layout>
                <input
                    style={{
                        padding: "9px 25px",
                        borderRadius: "3px",
                        border: "none",
                        backgroundColor: "#008060",
                        color: "#fff",
                        margin: "20px 0",
                        fontSize: "15px",
                        cursor: "pointer",
                    }}
                    type="submit"
                    value="Save"
                />
            </form>
        </Page>
    );
};

export default codepage;
