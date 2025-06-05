import LoginContextProvider from "@/context/LoginContextProvider";
import { render } from "@testing-library/react";

const customRender = (ui, options = {}) => {
  const AllTheProviders = ({ children }) => {
    return <LoginContextProvider>{children}</LoginContextProvider>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

export const createMockUser = () => ({
  email: "test@example.com",
  username: "testuser",
  password: "password123",
});

export const createMockApiResponse = (data, ok = true) => ({
  ok,
  json: () => Promise.resolve(data),
  status: ok ? 200 : 400,
});

export const createMockFetch = (response) => {
  return jest.fn(() => Promise.resolve(response));
};

export const waitForAsync = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export * from "@testing-library/react";

export { customRender as render };
