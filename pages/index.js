import Head from "next/head";
import { Nunito } from "next/font/google";
import { Prism } from "@mantine/prism";
import {
  Button,
  Container,
  Divider,
  Flex,
  Group,
  MantineProvider,
  Navbar,
  SegmentedControl,
  Select,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import {
  codeGet,
  codePost,
  getHeaders,
  getResponse404,
  getResponse429,
  postHeaders,
  postResponse400,
  postResponse404,
  postResponse429,
} from "../data/codeExamples";
import Image from "next/image";
import Logo from "../assets/IPCountryLogo.png";

const nunito = Nunito({ subsets: ["latin"] });

const ExampleMobileSelector = (props) => {
  const [windowWidth, setWindowWidth] = useState(undefined);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowWidth > 768 ? (
    <SegmentedControl {...props} />
  ) : (
    <Select {...props} />
  );
};

export default function Home() {
  const [userData, setUserData] = useState({});
  const [searchIP, setSearchIP] = useState("");
  const [searchResultData, setSearchResultData] = useState({});
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [responseExampleController, setResponseExampleController] = useState({
    get: "200",
    post: "200",
  });
  useEffect(() => {
    const getData = async () => {
      const req = await fetch("https://api.ipcountry.dev/getCountryCode");
      const res = await req.json();
      setUserData(res);
      setSearchResultData(res);
      setSearchIP(res.ip);
    };
    getData();
  }, []);

  const returnGetExample = (status) => {
    switch (status) {
      case "200":
        return JSON.stringify(userData, null, 2);
      case "404":
        return getResponse404;
      case "429":
        return getResponse429;
    }
  };

  const returnPostExample = (status) => {
    switch (status) {
      case "200":
        return JSON.stringify(userData, null, 2);
      case "400":
        return postResponse400;
      case "404":
        return postResponse404;
      case "429":
        return postResponse429;
    }
  };

  const getCountry = async (e, ip) => {
    e.preventDefault();
    setWaitingResponse(true);
    const req = await fetch("https://api.ipcountry.dev/getCountryCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ip }),
    });
    const res = await req.json();
    setWaitingResponse(false);
    setSearchResultData(res);
  };

  return (
    <div>
      <MantineProvider
        theme={{
          colors: {
            primary: [
              "#1A3CC9",
              "#1A3CC9",
              "#1A3CC9",
              "#1A3CC9",
              "#1A3CC9",
              "#1A3CC9",
              "#1A3CC9",
              "#1A3CC9",
            ],
          },
          primaryColor: "primary",
        }}
      >
        <Head>
          <title>IP-Country</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Container size="md" className={nunito.className}>
          <Flex direction="column" gap={64}>
            <Flex direction="column" gap="md" style={{ marginTop: 64 }}>
              <Image src={Logo} width={300} />
              <Text fz="md">
                IP-Country is a completely free API that allows you to get the
                IP and the Country ISO code of the user.
              </Text>
              <Text fz="md">
                There are 2 endpoints, one for GET and one for POST.
              </Text>
              <Flex direction="column" gap={16}>
                <form onSubmit={(e) => getCountry(e, searchIP)}>
                  <Flex align="flex-end">
                    <TextInput
                      value={searchIP}
                      onChange={(e) => setSearchIP(e.target.value)}
                      label="IP Address"
                    />
                    <Button
                      type="submit"
                      style={{ marginLeft: 18 }}
                      loading={waitingResponse}
                    >
                      Get Country
                    </Button>
                  </Flex>
                </form>
                <Flex direction="column">
                  <Text size="sm">Response:</Text>
                  <Prism language="js">
                    {JSON.stringify(searchResultData, null, 2)}
                  </Prism>
                </Flex>
              </Flex>
            </Flex>
            <Divider size="sm" />
            <Flex direction="column" gap={64}>
              <Flex direction="column" gap="md">
                <Title order={3} color="primary">
                  API Endpoint
                </Title>
                <Prism language="text">
                  https://api.ipcountry.dev/getCountryCode
                </Prism>
                <Text fz="md">
                  If you reach the limit, you will get a 429 error. You can read
                  the "RateLimit-Reset" header to know when you can retry (in
                  seconds).
                </Text>
              </Flex>
              <Flex direction="column" gap="md">
                <Title order={2} color="primary">
                  - GET
                </Title>
                <Text fz="md">
                  This endpoint is ideal in <u>client-side</u> applications,
                  with one request you can get the ip address and the location.
                </Text>
                <Text fz="md">
                  This endpoint is limited to 10 requests per second per
                  user/IP.
                </Text>
                <Text fz="md">
                  The limit is counted towards the originating IP address.
                </Text>
                <div>
                  <Text fz="lg">Usage:</Text>
                </div>
                <div>
                  <Prism language="js">{codeGet()}</Prism>
                </div>
                <div>
                  <Text fz="lg">Response Headers (example):</Text>
                  <Prism language="json">{getHeaders}</Prism>
                </div>
                <div>
                  <Text fz="lg">Response Body:</Text>
                  <ExampleMobileSelector
                    value={responseExampleController.get}
                    onChange={(value) =>
                      setResponseExampleController({
                        ...responseExampleController,
                        get: value,
                      })
                    }
                    data={[
                      { label: "Success (200)", value: "200" },
                      { label: "IP Not found (404)", value: "404" },
                      { label: "Rate limit exceeded (429)", value: "429" },
                    ]}
                  />

                  <Prism language="json">
                    {returnGetExample(responseExampleController.get)}
                  </Prism>
                </div>
              </Flex>

              <Flex direction="column" gap="md">
                <Title order={2} color="primary">
                  - POST
                </Title>
                <Text fz="md">
                  This endpoint is useful for <u>server-side</u> applications,
                  calling this endpoint from the server lets you know the
                  location of the user and serve the right data from your
                  server.
                </Text>
                <Text fz="md">
                  This endpoint is limited to 50 requests per 5 seconds.
                </Text>
                <Text fz="md">
                  The limit is counted towards the originating IP address and
                  not the IP requested.
                </Text>
                <div>
                  <Text fz="lg">Usage:</Text>
                  <Prism language="js">{codePost(userData.ip)}</Prism>
                </div>
                <div>
                  <Text fz="lg">Response Headers (example):</Text>
                  <Prism language="json">{postHeaders}</Prism>
                </div>
                <div>
                  <Text fz="lg">Response Body:</Text>
                  <ExampleMobileSelector
                    value={responseExampleController.post}
                    onChange={(value) =>
                      setResponseExampleController({
                        ...responseExampleController,
                        post: value,
                      })
                    }
                    data={[
                      { label: "Success (200)", value: "200" },
                      { label: "Invalid request (400)", value: "400" },
                      { label: "IP Not found (404)", value: "404" },
                      { label: "Rate limit exceeded (429)", value: "429" },
                    ]}
                  />
                  <Space />
                  <Prism language="json">
                    {returnPostExample(responseExampleController.post)}
                  </Prism>
                </div>
              </Flex>
            </Flex>
            <Space />
          </Flex>
        </Container>
      </MantineProvider>
    </div>
  );
}
