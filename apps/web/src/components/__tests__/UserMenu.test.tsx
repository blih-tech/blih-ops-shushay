import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserMenu } from "../ui/GlobalNavbar/UserMenu";

describe("UserMenu Dropdown", () => {
  const dummyUser = {
    email: "test@example.com",
    role: "TALENT",
  };

  it("toggles dropdown when avatar button is clicked", () => {
    render(
      <UserMenu
        user={dummyUser}
        skillsUrl=""
        talentUrl=""
      />
    );

    const button = screen.getByRole("button", { name: /user account menu/i });
    expect(screen.queryByText("Sign Out")).toBeNull();

    // Open dropdown
    fireEvent.click(button);
    expect(screen.getByText("Signed in as")).toBeDefined();
    expect(screen.getByText("test@example.com")).toBeDefined();
    expect(screen.getByText("View Talent Profile")).toBeDefined();
  });

  it("keeps dropdown open and executes onSignOut when Sign Out is clicked", () => {
    const handleSignOut = vi.fn();

    render(
      <UserMenu
        user={dummyUser}
        skillsUrl=""
        talentUrl=""
        onSignOut={handleSignOut}
      />
    );

    // Open dropdown
    const avatarButton = screen.getByRole("button", { name: /user account menu/i });
    fireEvent.click(avatarButton);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });

    // mousedown inside dropdown should NOT prematurely close it before click
    fireEvent.mouseDown(signOutButton);
    expect(screen.getByText("test@example.com")).toBeDefined();

    // Click sign out
    fireEvent.click(signOutButton);
    expect(handleSignOut).toHaveBeenCalledTimes(1);
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <div>
        <div data-testid="outside-element">Outside</div>
        <UserMenu
          user={dummyUser}
          skillsUrl=""
          talentUrl=""
        />
      </div>
    );

    const avatarButton = screen.getByRole("button", { name: /user account menu/i });
    fireEvent.click(avatarButton);
    expect(screen.getByText("test@example.com")).toBeDefined();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId("outside-element"));
    expect(screen.queryByText("test@example.com")).toBeNull();
  });
});
