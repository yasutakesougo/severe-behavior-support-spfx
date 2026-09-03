/**
 * STAFF-ARRIVAL-1 — smoke-only driver.
 * Clicks public #584 DOM only. Does not import SupportPlan session APIs.
 */

const REASON = "活動切替前の予告方法を見直す必要がある";
const TIMEOUT_MS = 20000;

function waitFor<T extends Element>(selector: string, predicate?: (el: T) => boolean): Promise<T> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = (): void => {
      const el = document.querySelector(selector);
      if (el instanceof Element && (!predicate || predicate(el as T))) {
        resolve(el as T);
        return;
      }
      if (Date.now() - started > TIMEOUT_MS) {
        reject(new Error(`STAFF-ARRIVAL timeout: ${selector}`));
        return;
      }
      window.requestAnimationFrame(tick);
    };
    tick();
  });
}

function fillTextarea(el: HTMLTextAreaElement, value: string): void {
  const proto = window.HTMLTextAreaElement.prototype;
  const desc = Object.getOwnPropertyDescriptor(proto, "value");
  if (desc?.set) {
    desc.set.call(el, value);
  } else {
    el.value = value;
  }
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

export async function driveBeforeApplyPublicDom(): Promise<void> {
  const usersNav = document.querySelector('[data-shell-ux-nav="users"]');
  if (usersNav instanceof HTMLButtonElement && !usersNav.disabled) {
    usersNav.click();
  }

  const openPlan = await waitFor<HTMLButtonElement>(
    '[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-a"]',
  );
  openPlan.click();

  await waitFor('[data-demo-ux="support-plan"]');
  const reason = await waitFor<HTMLTextAreaElement>('[data-review-outcome-reason-input="true"]');
  fillTextarea(reason, REASON);

  const changeRequired = await waitFor<HTMLButtonElement>(
    '[data-review-outcome-action="CHANGE_REQUIRED"]',
  );
  changeRequired.click();

  await waitFor('[data-review-outcome-readback="true"]');
  const start = await waitFor<HTMLButtonElement>(
    '[data-sbs-mgmt-loop-b-action="start-revision"]',
    (button) => !button.disabled,
  );
  start.click();

  await waitFor('[data-sbs-mgmt-loop-b-draft="true"]');
  await waitFor<HTMLButtonElement>(
    '[data-sbs-mgmt-plan-activation-c-action="apply"]',
    (button) => !button.disabled,
  );
}
