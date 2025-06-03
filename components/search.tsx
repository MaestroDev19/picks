"use client";
import { useState } from "react";
import { searchApi } from "@/data/data";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await searchApi(query);
    setResults(res.results);
  };
}
