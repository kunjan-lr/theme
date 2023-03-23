import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetch('/wordpress/wp-json/wp/v2/menu')
      .then(response => response.json())
      .then(data => {
        console.log(data); // log the menu items to the console
        setMenuItems(data)
      })
      .catch(error => console.log(error));
  }, []);

  const renderMenuItems = (items) => {
    return items.map((item, i) => {
      if (item.menu_item_parent === "0") {
        const last = item.url.split("/");
        const val = i+1 === 1 ? 1 : '2';
        return (
          <li className="nav-item" key={item.ID}>
            <Link to={`wordpress/${last[last.length-val]}`} className="nav-link text-white">{item.title}</Link>
            {renderSubMenuItems(item.ID)}
          </li>
        )
      }
    })
  }

  const renderSubMenuItems = (parentId) => {
    const subMenuItems = menuItems.filter(item => item.menu_item_parent == parentId);
    if (subMenuItems.length > 0) {
      return (
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          {subMenuItems.map(subItem => (
            <li className="nav-item" key={subItem.ID}>
              <a href={subItem.url} className="nav-link text-black">{subItem.title}</a>
              {renderSubMenuItems(subItem.ID)}
            </li>
          ))}
        </ul>
      )
    }
  }

  return (
    <div>
      <ul className="navbar-nav ml-auto">
        {renderMenuItems(menuItems)}
      </ul>
    </div>
  );
};

export default Menu;
