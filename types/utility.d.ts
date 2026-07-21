declare namespace Utility {
  type StringPairObject = { [key: string]: string };
  type DefaultFunction = () => void;
  type DefaultAsyncFunction = () => Promise<void>;

  type DefaultObject = { [key: string]: unknown };
}
