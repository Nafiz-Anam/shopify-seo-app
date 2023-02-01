import { TitleBar } from "@shopify/app-bridge-react";
import { Card, Heading, Layout, Page, TextField } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { useAuthenticatedFetch } from "../hooks";

const editpage = () => {
    const fetch = useAuthenticatedFetch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [textFieldValue, setTextFieldValue] = useState("");
    const [titleValue, setTitleValue] = useState("");
    const [descValue, setDescValue] = useState("");
    const [loading, setLoading] = useState(false);
    const handleKeywordChange = useCallback(
        (value) => setTextFieldValue(value),
        []
    );
    const handleTitleChange = useCallback((value) => setTitleValue(value), []);
    const handleDescChange = useCallback((value) => setDescValue(value), []);

    const pageInfo = JSON.parse(localStorage.getItem("pageInfo"));
    // console.log(pageInfo);
    const page_id = pageInfo.page_id[0];
    // console.log(pageInfo.page_id[0]);

    const onSubmit = async (data) => {
        setLoading(true);
        data.keyword = textFieldValue;
        data.page_id = page_id;
        data.page_title = titleValue;
        data.page_description = descValue;
        console.log("form entry => ", data);

        const method = "PUT";
        const response = await fetch("/api/pages/update", {
            method,
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });
        console.log("api response => ", response);
        if (response.ok) {
            setLoading(false);
        }
    };
    // console.log("form err => ", errors);

    return (
        <Page
            fullWidth
            breadcrumbs={[{ content: "Edit SEO", url: "/editseo" }]}
            title="Edit Page"
        >
            <TitleBar disabled />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Layout>
                    <Layout.Section>
                        <Card sectioned>
                            <div style={{ marginBottom: "10px" }}>
                                <Heading>Target Keyword</Heading>
                            </div>
                            <TextField
                                value={textFieldValue}
                                onChange={handleKeywordChange}
                                maxLength={20}
                                autoComplete="off"
                                showCharacterCount
                            />
                        </Card>
                        <Card sectioned>
                            <div>
                                <TextField
                                    value={titleValue}
                                    onChange={handleTitleChange}
                                    maxLength={60}
                                    autoComplete="off"
                                    showCharacterCount
                                    label="Meta Title"
                                />
                            </div>
                            <div style={{ marginTop: "10px" }}>
                                <TextField
                                    value={descValue}
                                    onChange={handleDescChange}
                                    multiline={4}
                                    autoComplete="off"
                                    maxLength={165}
                                    showCharacterCount
                                    label="Meta Description"
                                />
                            </div>
                        </Card>
                    </Layout.Section>
                    <Layout.Section secondary>
                        {/* <Card sectioned>
                            <Heading>Mark as done</Heading>
                        </Card> */}
                        <Card sectioned>
                            <Heading>SEO score</Heading>
                            <div
                                style={{
                                    padding: "30px 0",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <h1
                                    style={{
                                        fontSize: "55px",
                                        fontWeight: 600,
                                    }}
                                >
                                    0
                                </h1>
                            </div>
                        </Card>
                        <Card sectioned>
                            <Heading>Meta data status</Heading>
                            <div style={{ marginTop: "10px" }}>
                                <p>Title tag</p>
                                <ul style={{ listStyle: "none" }}>
                                    <li style={{ color: "red" }}>
                                        <RxCross2 /> Keyword not found in title
                                    </li>
                                    {/* <li style={{ color: "green" }}>
                                        <FiCheck /> Keyword in title
                                    </li> */}
                                    <li style={{ color: "red" }}>
                                        <RxCross2 /> Title length is too sort
                                    </li>
                                    {/* <li style={{ color: "green" }}>
                                        <FiCheck /> Title length is good
                                    </li> */}
                                </ul>
                            </div>
                            <div>
                                <p>Description tag</p>
                                <ul style={{ listStyle: "none" }}>
                                    {/* <li style={{ color: "green" }}>
                                        <FiCheck /> Keyword in description
                                    </li> */}
                                    <li style={{ color: "red" }}>
                                        <RxCross2 /> Keyword not found in
                                        description
                                    </li>
                                    <li style={{ color: "red" }}>
                                        <RxCross2 /> Description is too short
                                    </li>
                                    {/* <li style={{ color: "green" }}>
                                        <FiCheck /> Description length is good
                                    </li> */}
                                </ul>
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

export default editpage;
