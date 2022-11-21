import React from "react";
import { Outlet } from "react-router-dom";

function Blog() {
  return (
    <>
    <h1 className="text-center mt-5">Blog</h1>
        <Outlet />
    </>
  );
}

export default Blog;