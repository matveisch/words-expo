import ContentLoader, { Rect } from 'react-content-loader/native';

type Props = {
  height: number;
};

const MyLoader = (props: Props) => {
  const { height } = props;

  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={height}
      // viewBox="0 0 373 59"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <Rect x="0" y="0" rx="8" ry="8" width="100%" height="100%" />
    </ContentLoader>
  );
};

export default MyLoader;
