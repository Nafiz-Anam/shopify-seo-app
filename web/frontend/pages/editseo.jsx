import { useEffect, useState } from "react";
import {
    Page,
    Card,
    Layout,
    Heading,
    TextContainer,
    Button,
    Modal,
    ResourceList,
    ResourceItem,
} from "@shopify/polaris";
import { ViewMajor, EditMajor } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery } from "../hooks";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";

const EditSeo = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isBlogsLoading, setIsBlogsLoading] = useState(true);
    const [isPagesLoading, setIsPagesLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(true);

    const { data, isLoading: isLoadingCount } = useAppQuery({
        url: "/api/products/count",
        reactQueryOptions: {
            onSuccess: () => {
                setIsLoading(false);
            },
        },
    });
    console.log(data);

    const { data: blogs, isLoading: isLoadingBlogsCount } = useAppQuery({
        url: "/api/blogs/count",
        reactQueryOptions: {
            onSuccess: () => {
                setIsBlogsLoading(false);
            },
        },
    });
    console.log(blogs);

    const { data: pages, isLoading: isLoadingPagesCount } = useAppQuery({
        url: "/api/pages/count",
        reactQueryOptions: {
            onSuccess: () => {
                setIsPagesLoading(false);
            },
        },
    });
    console.log(pages);

    const [allPages, setAllPages] = useState([]);
    const { data: allPagesData, isLoading: isPageLoading } = useAppQuery({
        url: "/api/pages/all",
        reactQueryOptions: {
            onSuccess: () => {
                setPageLoading(false);
            },
        },
    });
    console.log("allPages =>", allPages);
    // console.log("allPages =>", allPagesData);
    useEffect(() => {
        if (allPagesData && allPagesData.length) {
            setAllPages(allPagesData);
        }
    }, [allPagesData]);

    const [pPicker, setPPicker] = useState(false);
    const [cPicker, setCPicker] = useState(false);

    const selectProducts = () => {
        return setPPicker(true);
    };
    const selectCol = () => {
        return setCPicker(true);
    };

    const handleProSelections = (resources) => {
        console.log("resources", resources);
        localStorage.setItem("productInfo", JSON.stringify(resources));
        navigate("/editproduct");
        setPPicker(false);
    };
    const handleColSelections = (resources) => {
        console.log("resources", resources);
        setCPicker(false);
    };

    // modal codes

    const [active, setActive] = useState(false);

    const toggleModal = () => {
        setActive(!active);
    };
    const [active2, setActive2] = useState(false);

    const toggleModal2 = () => {
        setActive2(!active2);
    };

    const [selectedItems, setSelectedItems] = useState([]);

    const resourceName = {
        singular: "page",
        plural: "pages",
    };

    return (
        <Page
            fullWidth
            breadcrumbs={[{ content: "Products", url: "/products" }]}
            title="Edit SEO"
            subtitle="Control the SEO settings for your products and collections"
        >
            <TitleBar disabled />
            <Layout>
                {/* products selection card  */}
                <Layout.Section oneThird>
                    <Card
                        sectioned
                        primaryFooterAction={{
                            content: "Select",
                            onAction: selectProducts,
                        }}
                    >
                        <Heading>Products</Heading>
                        <ResourcePicker
                            resourceType="Product"
                            open={pPicker}
                            selectMultiple={false}
                            onCancel={() => {
                                setPPicker(false);
                            }}
                            onSelection={(resources) => {
                                handleProSelections(resources);
                            }}
                        />
                        <div
                            style={{
                                padding: "30px 0",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <h1 style={{ fontSize: "55px", fontWeight: 600 }}>
                                {isLoadingCount ? "-" : data.count}
                            </h1>
                        </div>
                    </Card>
                </Layout.Section>

                {/* collection selection card  */}
                <Layout.Section oneThird>
                    <Card
                        sectioned
                        primaryFooterAction={{
                            content: "Select",
                            onAction: selectCol,
                        }}
                    >
                        <Heading>Collections</Heading>
                        <ResourcePicker
                            resourceType="Collection"
                            open={cPicker}
                            onCancel={() => {
                                setCPicker(false);
                            }}
                            onSelection={(resources) => {
                                handleColSelections(resources);
                            }}
                        />
                        <div
                            style={{
                                padding: "30px 0",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <h1 style={{ fontSize: "55px", fontWeight: 600 }}>
                                0
                            </h1>
                        </div>
                    </Card>
                </Layout.Section>

                {/* page selection card  */}
                <Layout.Section oneThird>
                    <Card
                        sectioned
                        primaryFooterAction={{
                            content: "Select",
                            onAction: toggleModal,
                        }}
                    >
                        <Heading>Pages</Heading>
                        <div
                            style={{
                                padding: "30px 0",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <h1 style={{ fontSize: "55px", fontWeight: 600 }}>
                                {isLoadingPagesCount ? "-" : pages.count}
                            </h1>
                        </div>
                    </Card>
                </Layout.Section>

                {/* blog selection card  */}
                <Layout.Section oneThird>
                    <Card
                        sectioned
                        primaryFooterAction={{
                            content: "Select",
                            onAction: toggleModal2,
                        }}
                    >
                        <Heading>Blogs Posts</Heading>
                        <div
                            style={{
                                padding: "30px 0",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <h1 style={{ fontSize: "55px", fontWeight: 600 }}>
                                {isLoadingBlogsCount ? "-" : blogs.count}
                            </h1>
                        </div>
                    </Card>
                </Layout.Section>

                {/* second row  */}
                <Layout.Section fullWidth>
                    <Card sectioned>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                margin: "10px 0",
                            }}
                        >
                            <div style={{ width: "20%" }}>
                                <h2 style={{ fontWeight: 500 }}>Search</h2>
                            </div>
                            <div style={{ width: "60%" }}>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Porro recusandae deleniti
                                    distinctio cumque, non cupiditate ad illo
                                    nobis soluta? Provident qui molestias
                                    corrupti odit eveniet!
                                </p>
                            </div>
                            <div style={{ width: "20%" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ margin: "0 5px" }}>
                                        <Button icon={ViewMajor}>View</Button>
                                    </div>
                                    <div style={{ margin: "0 5px" }}>
                                        <Button icon={EditMajor}>Edit</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                margin: "10px 0",
                            }}
                        >
                            <div style={{ width: "20%" }}>
                                <h2 style={{ fontWeight: 500 }}>Search</h2>
                            </div>
                            <div style={{ width: "60%" }}>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Porro recusandae deleniti
                                    distinctio cumque, non cupiditate ad illo
                                    nobis soluta? Provident qui molestias
                                    corrupti odit eveniet!
                                </p>
                            </div>
                            <div style={{ width: "20%" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ margin: "0 5px" }}>
                                        <Button icon={ViewMajor}>View</Button>
                                    </div>
                                    <div style={{ margin: "0 5px" }}>
                                        <Button icon={EditMajor}>Edit</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                margin: "10px 0",
                            }}
                        >
                            <div style={{ width: "20%" }}>
                                <h2 style={{ fontWeight: 500 }}>Search</h2>
                            </div>
                            <div style={{ width: "60%" }}>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Porro recusandae deleniti
                                    distinctio cumque, non cupiditate ad illo
                                    nobis soluta? Provident qui molestias
                                    corrupti odit eveniet!
                                </p>
                            </div>
                            <div style={{ width: "20%" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ margin: "0 5px" }}>
                                        <Button icon={ViewMajor}>View</Button>
                                    </div>
                                    <div style={{ margin: "0 5px" }}>
                                        <Button icon={EditMajor}>Edit</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                margin: "10px 0",
                            }}
                        >
                            <div style={{ width: "20%" }}>
                                <h2 style={{ fontWeight: 500 }}>Search</h2>
                            </div>
                            <div style={{ width: "60%" }}>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Porro recusandae deleniti
                                    distinctio cumque, non cupiditate ad illo
                                    nobis soluta? Provident qui molestias
                                    corrupti odit eveniet!
                                </p>
                            </div>
                            <div style={{ width: "20%" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ margin: "0 5px" }}>
                                        <Button icon={ViewMajor}>View</Button>
                                    </div>
                                    <div style={{ margin: "0 5px" }}>
                                        <Button icon={EditMajor}>Edit</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Layout.Section>
                <Layout.Section oneHalf>
                    <Card
                        sectioned
                        title="Readability Test Tool"
                        primaryFooterAction={{ content: "Use The Tool" }}
                        secondaryFooterActions={[{ content: "Edit shipment" }]}
                    >
                        <TextContainer>
                            <p>
                                If you’re stuck have a look at our support docs
                                or let us know what’s going on.
                            </p>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section oneHalf>
                    <Card
                        sectioned
                        title="Get Support"
                        primaryFooterAction={{
                            content: "Support Documentation",
                        }}
                    >
                        <TextContainer>
                            <p>
                                If you’re stuck have a look at our support docs
                                or let us know what’s going on.
                            </p>
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>

            {/* custom modals  */}
            <Modal
                open={active}
                onClose={toggleModal}
                title="Select Page"
                primaryAction={{
                    content: "Select",
                    // onAction: handleClose,
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        // onAction: handleClose,
                    },
                ]}
            >
                <Modal.Section>
                    <ResourceList
                        resourceName={resourceName}
                        items={(allPages && allPages) || []}
                        renderItem={renderItem}
                        selectedItems={selectedItems}
                        onSelectionChange={setSelectedItems}
                        selectable
                    />
                </Modal.Section>
            </Modal>

            <Modal
                open={active2}
                onClose={toggleModal2}
                title="Select Blog Article"
                primaryAction={{
                    content: "Select",
                    // onAction: handleClose,
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        // onAction: handleClose,
                    },
                ]}
            >
                <Modal.Section></Modal.Section>
            </Modal>
        </Page>
    );

    function renderItem(item) {
        const { id, title } = item;

        return (
            <ResourceItem
                id={id}
                accessibilityLabel={`View details for ${title}`}
            >
                <Heading>{title}</Heading>
            </ResourceItem>
        );
    }
};

export default EditSeo;
