import { Card, Heading, Image, Page, TextContainer } from "@shopify/polaris";
import React from "react";
import { logoImg } from "../assets";

const NewHome = () => {
    return (
        <Page fullWidth>
            <Card sectioned>
                <TextContainer>
                    <Heading>This is the text</Heading>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Tempora, quo assumenda doloremque saepe voluptatum
                        nobis ullam quia excepturi quis laudantium voluptatibus
                        facilis quod corrupti ab magni, iure ratione quaerat
                        veniam cum! Dolorem officia temporibus ab eos natus
                        voluptatem modi quisquam eum quod impedit iste quam sed
                        eaque, non quos magnam!
                    </p>
                </TextContainer>
            </Card>
            <Card sectioned>
                <Heading>Heading</Heading>
                <TextContainer>
                    <p>Body</p>
                </TextContainer>
            </Card>
            <Card sectioned>
                <Image source={logoImg} width={120} />
            </Card>
        </Page>
    );
};

export default NewHome;
