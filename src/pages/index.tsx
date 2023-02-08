import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";

import { ReactElement, useEffect, useState } from "react";
import { io } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const [dataFeed, setDataFeed] = useState("");
  const [ws, setWs] = useState<WebSocket>();
  const [reconnect, setReconnect] = useState<number>(0);

  const [tweets, setTweets] = useState([] as ReactElement[]);

  useEffect(() => {
    var socket = io("wss://earthquakefeed.heroesofnft.com", { transports: ["websocket"] });

    socket.on("connect", function () {
      const engine = socket.io.engine;

      console.log("connected!");
      socket.emit("greet", { message: "Hello Mr.Server!" });

      engine.once("upgrade", () => {
        // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
        console.log(engine.transport.name); // in most cases, prints "websocket"
      });
    });

    socket.on("msg_go", (message) => {
      const response: Array<any> = JSON.parse(message);

      if (response.length) {
        const elementList: Array<ReactElement> = [];

        const element = (
          <tr key={response[0].id}>
            <td className="px-2 py-4 text-sm text-slate-400	whitespace-nowrap">
              {new Date(response[0].created_at).toLocaleTimeString()}
            </td>
            <td className="px-2 py-4 text-sm text-slate-400 whitespace-nowrap">
              {response[0].user_name}
            </td>
            <td className="px-8 py-4 text-sm text-slate-400 flex-wrap">
              {response[0].full_text ? response[0].full_text : response[0].text}
            </td>
          </tr>
        );
        elementList.push(element);

        setTweets((oldList) => [...oldList, ...elementList]);
      }
    });
  }, [reconnect]);

  return (
    <>
      <h2 className="text-3xl font-bold underline">
        This page is intended to filter out the tweets with addresses
      </h2>
      {/* <h2 className="text-3xl font-bold underline">{dataFeed}</h2> */}

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                    >
                      <a href="">tweet</a>
                      Username
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                    >
                      Tweet
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">{tweets}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
