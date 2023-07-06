const main = require("../../index");
const { rest } = require("msw");
const { setupServer } = require("msw/node");

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("happy path", () => {

  beforeEach(() => {
    const host = "https://api.github.com";
    server.use(
      rest.get(
        `${host}/repos/department-of-veterans-affairs/va.gov-team/issues`,
        (req, res, ctx) => res(
          ctx.json([
            {
              title: "Platform Orientation Template",
              body: "GitHub handle*: octocat\n",
              created_at: "2023-07-01T00:00:00Z",
            },
          ])
        )
      ),
      rest.get(
        `${host}/repos/department-of-veterans-affairs/vets-website/commits`,
        (req, res, ctx) => res(
          ctx.json([
            {
              commit: {
                author: {
                  date: "2023-07-04T00:00:00Z",
                },
              },
            },
          ])
        )
      ),
      rest.get(
        `${host}/repos/department-of-veterans-affairs/vets-api/commits`,
        (req, res, ctx) => res(ctx.json([]))
      )
    );
  });

  it("calculates the mean time to commit", async () => {
    const consoleSpy = jest.spyOn(console, "log");

    await main();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Mean Time to First Commit: 3.00 days"
    );
  })
});
