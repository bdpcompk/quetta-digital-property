"use client";

import { useEffect, useState } from "react";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import ArticleCard from "@/components/properties/ArticleCard";
import { ARTICLES, getArticles } from "@/lib/data";
import type { Article } from "@/lib/types";

export default function GuidesGrid() {
  const [list, setList] = useState<Article[]>(ARTICLES);

  useEffect(() => {
    getArticles().then(setList);
  }, []);

  return (
    <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((a) => (
        <StaggerItem key={a.id}>
          <ArticleCard a={a} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
