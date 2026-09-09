import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearchChange: (value: string) => void;
}

function SearchBox({ onSearchChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      defaultValue={""}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
}

export default SearchBox;
