import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";

import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const [dataFeed, setDataFeed] = useState("");
  const [ws, setWs] = useState<WebSocket>();

  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    var _ws = new WebSocket("ws://localhost:8080");
    setWs(_ws);

    _ws.onmessage = function (event) {
      try {
        const response: Array<any> = JSON.parse(event.data);

        const elementList = [];
        for (const r in response) {
          const element = (
            <tr key={response[r].key}>
              <td className="px-6 py-4 text-sm font-medium text-slate-400	whitespace-nowrap">
                {new Date(response[r].created_at).toLocaleTimeString()}
              </td>
              <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                {response[r].userName}
              </td>
              <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                {response[r].fullText ? response[r].fullText : response[r].text}
              </td>
            </tr>
          );
          elementList.push(element);
        }
        setTweets((oldList) => [...oldList, ...elementList]);
      } catch (error) {
        setDataFeed(event.data.toString());
      }

      //setDataFeed(event.data.toString());
    };
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <h2 className="text-3xl font-bold underline">{dataFeed}</h2>
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
                      Username
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                    >
                      Tweet
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                    >
                      Edit
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                    >
                      Delete
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
