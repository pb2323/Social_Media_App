import React from "react";
import { Menu, Container, Icon } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";

function Navbar() {
  const router = useRouter();
  const isActive = (route) => router.pathname === route;
  return (
    <Menu fluid borderless>
      <Container text>
        <Link href="/login">
          <Menu.Item header active={isActive("/login")}>
            <Icon name="sign in" size="large" />
            Login
          </Menu.Item>
        </Link>
        <Link href="/signup">
          <Menu.Item header active={isActive("/signup")}>
            <Icon name="signup" size="large" />
            SignUp
          </Menu.Item>
        </Link>
      </Container>
    </Menu>
  );
}

export default Navbar;
