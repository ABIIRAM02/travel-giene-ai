export const IconWrapper = ({
  IconName,
  style = {},
}: {
  IconName: any;
  style?: object;
}) => (
  <div 
  style={{...style}}
  className="h-5 w-5 text-primary flex items-center justify-center">
      <IconName />
  </div>
);
