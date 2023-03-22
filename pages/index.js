import Head from "next/head";
import { Nunito } from "next/font/google";
import { Prism } from "@mantine/prism";
import {
  Container,
  Flex,
  Group,
  SegmentedControl,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { codeGet, codePost } from "../data/codeExamples";
const nunito = Nunito({ subsets: ["latin"] });

export default function Home() {
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const getData = async () => {
      const req = await fetch("https://api.ipcountry.dev/getCountryCode");
      const res = await req.json();
      setUserData(res);
    };
    getData();
  }, []);

  return (
    <div>
      <Head>
        <title>IPCountry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size="lg" className={nunito.className}>
        <Flex direction="column" gap={96}>
          <Flex direction="column" gap="md">
            <Title order={1}>IPCountry</Title>
            <Text fz="md">
              IPCountry is a free API that allows you to get the IP and the
              Country ISO code of the user.
            </Text>
            <Text fz="md">
              There are 2 endpoints, one for GET and one for POST.
            </Text>
          </Flex>
          <Flex direction="column" gap={64}>
            <Flex direction="column" gap="md">
              <Title order={3}>API Endpoint:</Title>
              <Prism language="text">
                https://api.ipcountry.dev/getCountryCode
              </Prism>
            </Flex>
            <Flex direction="column" gap="md">
              <Title order={2}>GET</Title>
              <Text fz="md">
                This endpoint is ideal in front-end applications, with one
                request you can get the ip address and the location.
              </Text>
              <div>
                <Text fz="md">Usage:</Text>
                <Prism language="js">{codeGet()}</Prism>
              </div>
              <div>
                <Text fz="md">Response:</Text>
                <Prism language="json">
                  {JSON.stringify(userData, null, 2)}
                </Prism>
              </div>
            </Flex>

            <Flex direction="column" gap="md">
              <Title order={2}>POST</Title>
              <Text fz="md">
                This endpoint is useful for back-end applications, calling this
                endpoint from the server lets you know the location of the user
                and serve the right data from your server.
              </Text>
              <div>
                <Text fz="md">Usage:</Text>
                <Prism language="js">{codePost(userData.ip)}</Prism>
              </div>
              <div>
                <Text fz="md">Response:</Text>
                <Prism language="json">
                  {JSON.stringify(userData, null, 2)}
                </Prism>
              </div>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </div>
  );
}
