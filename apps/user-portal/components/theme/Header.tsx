import { Navbar, Nav, Container } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useSession } from 'next-auth/react';
import { SigninButton } from '../SigninButton';

export function Header() {
  const { data } = useSession();
  return (
    <Navbar bg="light" expand="sm">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Link href="/pantry" passHref legacyBehavior>
              <Nav.Link>Home</Nav.Link>
            </Link>
            <Link href="/pantry/posts" passHref legacyBehavior>
              <Nav.Link>News</Nav.Link>
            </Link>
            {data && (
              <>
                <Link href="/pantry/subscriptions" passHref legacyBehavior>
                  <Nav.Link>Pantry Membership</Nav.Link>
                </Link>
                <Link href="/profile" passHref legacyBehavior>
                  <Nav.Link>Profile</Nav.Link>
                </Link>
              </>
            )}

            <SigninButton />
          </Nav>
        </Navbar.Collapse>
        <Navbar.Brand
          style={{ marginLeft: `${4}rem`, marginBottom: `${1}rem` }}
        >
          <Link href="https://www.theoldchurchonthehill.com">
            <Image
              src="/images/logo-blue-oldchurch.png"
              height="70"
              width="100"
              alt="Old Church Logo"
            />
          </Link>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
