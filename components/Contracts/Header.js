import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
// import { Link } from "../routes";
import Link from "next/link";

export default class Header extends Component {
  render() {
    return (
      <div>
        <Menu style={{ marginTop: "10px" }}>
          <Link href="/contracts">
            Contract Factory
          </Link>

          <Menu.Menu position="right">
            <Link href="/contracts">
              <a className="item">Contract</a>
            </Link>
            <Link href="/contracts/new">
              +
            </Link>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}
