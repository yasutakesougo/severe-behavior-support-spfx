import type {
  GraphListPagePort,
  GraphListPageRequest,
  GraphListPageResult,
} from "../integration/sharepoint/support-plan-query";

/** Deterministic page sequence for local tests; it never sends HTTP requests. */
export class MockGraphListPagePort implements GraphListPagePort {
  public readonly requests: GraphListPageRequest[] = [];
  private nextPage = 0;

  public constructor(private readonly pages: readonly unknown[]) {}

  public async readPage(request: GraphListPageRequest): Promise<GraphListPageResult> {
    this.requests.push({ ...request });
    const page = this.pages[this.nextPage++];
    if (!page) return { status: "ERROR", reasonCode: "MOCK_GRAPH_PAGE_MISSING" };
    return page as GraphListPageResult;
  }
}
