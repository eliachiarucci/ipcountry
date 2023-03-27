import Head from "next/head";
import { Nunito } from "next/font/google";
import { Prism } from "@mantine/prism";
import {
  Button,
  Container,
  Flex,
  Group,
  SegmentedControl,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
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
const nunito = Nunito({ subsets: ["latin"] });

export default function Home() {
  const [userData, setUserData] = useState({});
  const [searchIP, setSearchIP] = useState("");
  const [searchResultData, setSearchResultData] = useState({});
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
    const req = await fetch("https://api.ipcountry.dev/getCountryCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ip }),
    });
    const res = await req.json();
    setSearchResultData(res);
  };

  return (
    <div>
      <Head>
        <title>IPCountry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size="md" className={nunito.className}>
        <Flex direction="column" gap={96}>
          <Flex direction="column" gap="md">
            <Space />
            <Title order={1}>IPCountry</Title>
            <Text fz="md">
              IPCountry is a completely free API that allows you to get the IP
              and the Country ISO code of the user.
            </Text>
            <Text fz="md">
              There are 2 endpoints, one for GET and one for POST.
            </Text>
            <Flex direction="column" gap={16}>
              <form onClick={(e) => getCountry(e, searchIP)}>
                <Flex align="flex-end">
                  <TextInput
                    value={searchIP}
                    onChange={(e) => setSearchIP(e.target.value)}
                    label="IP Address"
                  />
                  <Button type="submit" style={{ marginLeft: 18 }}>
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
          <Flex direction="column" gap={64}>
            <Flex direction="column" gap="md">
              <Title order={3}>API Endpoint:</Title>
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
              <Title order={2}>GET</Title>
              <Text fz="md">
                This endpoint is ideal in <u>client-side</u> applications, with
                one request you can get the ip address and the location.
              </Text>
              <Text fz="md">
                This endpoint is limited to 10 requests per second.
              </Text>
              <Text fz="md">
                The limit is counted towards the originating IP address.
              </Text>
              <div>
                <Text fz="lg">Usage:</Text>
              </div>
              <div>
                <Prism language="js">{codePost(userData.ip)}</Prism>
              </div>
              <div>
                <Text fz="lg">Response Headers (example):</Text>
                <Prism language="json">{getHeaders}</Prism>
              </div>
              <div>
                <Text fz="lg">Response Body:</Text>
                <SegmentedControl
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
              <Title order={2}>POST</Title>
              <Text fz="md">
                This endpoint is useful for <u>server-side</u> applications,
                calling this endpoint from the server lets you know the location
                of the user and serve the right data from your server.
              </Text>
              <Text fz="md">
                This endpoint is limited to 50 requests per 5 seconds.
              </Text>
              <Text fz="md">
                The limit is counted towards the originating IP address and not
                the IP requested.
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
                <SegmentedControl
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
    </div>
  );
}
