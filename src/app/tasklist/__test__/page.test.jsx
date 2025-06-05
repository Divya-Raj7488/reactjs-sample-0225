import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TasklistPage from "../page";

// Mock data for picsum API
const mockPicsumData = {
  id: "237",
  author: "André Spieker",
  width: 3500,
  height: 2095,
  url: "https://unsplash.com/photos/8wTPqxlnKM4",
  download_url: "https://picsum.photos/id/237/3500/2095",
};

describe("Tasklist Page", () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  test("renders tasklist page with heading", () => {
    render(<TasklistPage />);

    expect(
      screen.getByRole("heading", { name: /task list/i })
    ).toBeInTheDocument();
  });

  test("displays loading state initially", () => {
    // Mock pending fetch
    global.fetch = jest.fn(() => new Promise(() => {}));

    render(<TasklistPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("fetches and displays image data from picsum API", async () => {
    // Mock successful API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPicsumData),
      })
    );

    render(<TasklistPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/https:\/\/picsum\.photos\/id\/\d+\/info/)
      );
    });

    await waitFor(() => {
      expect(screen.getByText(mockPicsumData.author)).toBeInTheDocument();
      expect(
        screen.getByText(`${mockPicsumData.width} x ${mockPicsumData.height}`)
      ).toBeInTheDocument();
    });
  });

  test("displays error message when API call fails", async () => {
    // Mock failed API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    render(<TasklistPage />);

    await waitFor(() => {
      expect(screen.getByText(/error loading image data/i)).toBeInTheDocument();
    });
  });

  test("displays error message when network request fails", async () => {
    // Mock network error
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    render(<TasklistPage />);

    await waitFor(() => {
      expect(screen.getByText(/error loading image data/i)).toBeInTheDocument();
    });
  });

  test("refreshes data when refresh button is clicked", async () => {
    const user = userEvent.setup();

    // Mock successful API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPicsumData),
      })
    );

    render(<TasklistPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(mockPicsumData.author)).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    await user.click(refreshButton);

    // Should make another API call
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test("calls API with random ID between 0-999", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPicsumData),
      })
    );

    render(<TasklistPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const fetchCall = global.fetch.mock.calls[0][0];
    const idMatch = fetchCall.match(/\/id\/(\d+)\//);
    const id = parseInt(idMatch[1]);

    expect(id).toBeGreaterThanOrEqual(0);
    expect(id).toBeLessThanOrEqual(999);
  });

  test("displays image when image data is loaded", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPicsumData),
      })
    );

    render(<TasklistPage />);

    await waitFor(() => {
      const image = screen.getByRole("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        "src",
        expect.stringContaining("picsum.photos")
      );
      expect(image).toHaveAttribute(
        "alt",
        expect.stringContaining(mockPicsumData.author)
      );
    });
  });

  test("handles multiple rapid refresh clicks", async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPicsumData),
      })
    );

    render(<TasklistPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(mockPicsumData.author)).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole("button", { name: /refresh/i });

    // Click multiple times rapidly
    await user.click(refreshButton);
    await user.click(refreshButton);
    await user.click(refreshButton);

    // Should handle multiple clicks gracefully
    expect(global.fetch).toHaveBeenCalledTimes(4); // 1 initial + 3 refresh clicks
  });

  test("shows loading state during refresh", async () => {
    const user = userEvent.setup();

    // First call resolves immediately
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPicsumData),
        })
      )
      // Second call is delayed
      .mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve(mockPicsumData),
                }),
              100
            )
          )
      );

    render(<TasklistPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(mockPicsumData.author)).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    await user.click(refreshButton);

    // Should show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(refreshButton).toBeDisabled();
  });
});
