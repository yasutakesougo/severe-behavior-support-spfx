import * as React from "react";
import styles from "./Primitives.module.scss";

export type SingleSelectOption<T extends string> = Readonly<{
  id: T;
  label: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
  dataAttrs?: Readonly<Record<string, string | undefined>>;
}>;

export type SingleSelectListboxProps<T extends string> = Readonly<{
  ariaLabel: string;
  options: readonly SingleSelectOption<T>[];
  value: T | undefined;
  onChange: (next: T) => void;
  listDataAttrs?: Readonly<Record<string, string | undefined>>;
  className?: string;
}>;

/**
 * DADS-05 SingleSelectListbox — INV-10 FIX.
 * Proper listbox/option semantics with arrow-key support.
 * Does not use native button + role=option hybrid.
 */
export function SingleSelectListbox<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
  listDataAttrs,
  className,
}: SingleSelectListboxProps<T>): React.ReactElement {
  const optionIds = options.map((option) => option.id);
  const selectedIndex = value ? optionIds.indexOf(value) : 0;
  const [focusIndex, setFocusIndex] = React.useState(selectedIndex >= 0 ? selectedIndex : 0);
  const itemRefs = React.useRef<Array<HTMLLIElement | null>>([]);

  React.useEffect(() => {
    if (selectedIndex >= 0) {
      setFocusIndex(selectedIndex);
    }
  }, [selectedIndex]);

  const moveFocus = (nextIndex: number): void => {
    if (options.length === 0) {
      return;
    }
    const clamped = (nextIndex + options.length) % options.length;
    setFocusIndex(clamped);
    itemRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLUListElement>): void => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveFocus(focusIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(focusIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        moveFocus(0);
        break;
      case "End":
        event.preventDefault();
        moveFocus(options.length - 1);
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const option = options[focusIndex];
        if (option) {
          onChange(option.id);
        }
        break;
      }
      default:
        break;
    }
  };

  const listClass = [styles.singleSelectList, className].filter(Boolean).join(" ");

  return (
    <ul
      className={listClass}
      role="listbox"
      aria-label={ariaLabel}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      data-sbs-primitive="single-select-listbox"
      {...listDataAttrs}
    >
      {options.map((option, index) => {
        const selected = option.id === value;
        const focused = index === focusIndex;
        return (
          <li
            key={option.id}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={
              selected
                ? `${styles.singleSelectOption} ${styles.singleSelectOptionSelected}`
                : styles.singleSelectOption
            }
            {...option.dataAttrs}
            role="option"
            aria-selected={selected}
            tabIndex={focused ? 0 : -1}
            onClick={() => {
              onChange(option.id);
              setFocusIndex(index);
            }}
            onFocus={() => {
              setFocusIndex(index);
            }}
          >
            <div className={styles.singleSelectOptionBody}>
              <strong>{option.label}</strong>
              {option.description ? <p>{option.description}</p> : null}
            </div>
            {option.trailing}
          </li>
        );
      })}
    </ul>
  );
}
