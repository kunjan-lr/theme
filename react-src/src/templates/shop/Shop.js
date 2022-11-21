import React from 'react'
import { Outlet } from "react-router-dom";

function Shop() {
  return (
    <>
    <h1 className="text-center mt-5">Shop</h1>
    <Outlet />
    </>
  )
}

export default Shop