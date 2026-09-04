import * as React from "react";
import { SupportPlan as BaseSupportPlan, type SupportPlanProps } from "./SupportPlan";
import { MANAGEMENT_HOME_RESOLVED_FIXTURE } from "./management-home-fixture";
import {
  buildManagementHomeReadModel,
  type ManagementHomePresentation,
} from "./management-home-read-model";
import styles from "./ManagementHomeUx.module.scss";

export type ManagementHomeProps = Readonly<{
  presentation: ManagementHomePresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBack?: () => void;
}>;

export const ManagementHome: React.FC<ManagementHomeProps> = ({ presentation, headingRef, onBack }) => {
  return (
    <section
      className={styles.root}
      data-demo-ux="management-home"
      aria-labelledby="management-home-heading"
    >
      <h1
        id="management-home-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.heading}
      >
        支援マネジメント
      </h1>
      {onBack ? (
        <button type="button" className={styles.backButton} onClick={onBack}>
          ← 支援計画
        </button>
      ) : null}
      <p className={styles.personLabel}>{presentation.personLabel}</p>
      <div className={styles.grid}>
        <section className={styles.card} aria-labelledby="management-home-current-plan">
          <h2 id="management-home-current-plan">現在の計画</h2>
          <p>{presentation.currentPlanLabel}</p>
          {presentation.provenanceLabel ? (
            <p className={styles.secondary}>{presentation.provenanceLabel}</p>
          ) : null}
        </section>
        <section className={styles.card} aria-labelledby="management-home-review">
          <h2 id="management-home-review">見直し状況</h2>
          <p>{presentation.monitoringLabel}</p>
          <p>{presentation.reviewLabel}</p>
          <p>{presentation.reviewDueLabel}</p>
        </section>
        <section className={styles.card} aria-labelledby="management-home-revision">
          <h2 id="management-home-revision">変更対応状況</h2>
          <p>{presentation.revisionLabel}</p>
        </section>
        <section className={styles.card} aria-labelledby="management-home-next-action">
          <h2 id="management-home-next-action">次に必要な人の行動</h2>
          <p>{presentation.nextActionLabel}</p>
        </section>
      </div>
      {presentation.unavailableSections.length > 0 ? (
        <p
          className={styles.unavailable}
          role="status"
          data-demo-ux="management-home-unavailable"
        >
          一部の情報を確認できません。確認できない情報から状態や次の行動を推測していません。
        </p>
      ) : null}
    </section>
  );
};

export const SupportPlanWithManagementHome: React.FC<SupportPlanProps> = (props) => {
  const [homeOpen, setHomeOpen] = React.useState(false);
  const fixture = MANAGEMENT_HOME_RESOLVED_FIXTURE;
  const available =
    props.presentationRole === "PLANNER" &&
    props.presentation.userId === fixture.plan.UserId &&
    props.presentation.planId === fixture.plan.PlanId;

  React.useEffect(() => {
    if (!available && homeOpen) {
      setHomeOpen(false);
    }
  }, [available, homeOpen]);

  if (available && homeOpen) {
    return (
      <ManagementHome
        presentation={buildManagementHomeReadModel(fixture)}
        headingRef={props.headingRef}
        onBack={() => setHomeOpen(false)}
      />
    );
  }

  return (
    <div data-management-home-host={available ? "available" : "hidden"}>
      {available ? (
        <button
          type="button"
          className={styles.backButton}
          onClick={() => setHomeOpen(true)}
          data-demo-ux="management-home-open"
        >
          支援マネジメントを見る（読み取り専用）
        </button>
      ) : null}
      <BaseSupportPlan {...props} />
    </div>
  );
};