import React from 'react';
import Select from 'react-select';

export const FONTS = [
  { name: 'Abril Fatface', google: true },
  { name: 'Allerta', google: true },
  { name: 'Anivers' },
  { name: 'Arizonia', google: true },
  { name: 'Arvo', google: true },
  { name: 'Audimat' },
  { name: 'Berkshire Swash', google: true },
  { name: 'Chunkfive' },
  { name: 'Cookie', google: true },
  { name: 'Dancing Script', google: true },
  { name: 'Delicious' },
  { name: 'Droid Sans', google: true },
  { name: 'Fertigo' },
  { name: 'Fontin-Sans' },
  { name: 'Fontin' },
  { name: 'Great Vibes', google: true },
  { name: 'Handlee', google: true },
  { name: 'Indie Flower', google: true },
  { name: 'Josefin Slab', google: true },
  { name: 'Junction' },
  { name: 'Kalam', google: true },
  { name: 'Kristi', google: true },
  { name: 'Lato', google: true },
  { name: 'League Script', google: true },
  { name: 'Merienda One', google: true },
  { name: 'Old Standard TT', google: true },
  { name: 'Oleo Script', google: true },
  { name: 'Open Sans', google: true },
  { name: 'Playball', google: true },
  { name: 'Pompiere', google: true },
  { name: 'Prociono', google: true },
  { name: 'Qwigley', google: true },
  { name: 'Rock Salt', google: true },
  { name: 'Sacramento', google: true },
  { name: 'Stalemate', google: true },
  { name: 'Ubuntu', google: true },
  { name: 'Vollkorn', google: true },
  { name: 'Waiting for the Sunrise', google: true },
  { name: 'Yellowtail', google: true }
];

const FontSelect = props => {
  const renderOption = option => {
    return <div style={{ fontFamily: `"${option.name}"` }}>{option.name}</div>;
  };

  const renderValue = option => {
    return <div style={{ fontFamily: `"${option.name}"` }}>{option.name}</div>;
  };

  return (
    <Select
      {...props}
      valueKey="name"
      options={FONTS}
      clearable={false}
      optionRenderer={renderOption}
      valueRenderer={renderValue}
    />
  );
};

export default FontSelect;
