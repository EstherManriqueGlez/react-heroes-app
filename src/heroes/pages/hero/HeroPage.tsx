import { useParams } from 'react-router';

export const HeroPage = () => {

  const { idSlug = '' } = useParams();

  console.log({ idSlug });



  return <div>HeroPage</div>;
};
