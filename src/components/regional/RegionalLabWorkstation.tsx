import React from 'react';
import { UserProfile } from '../../types/navigation';
import { RegionalMappingView } from './RegionalMappingView';
import { RegionalReferralApplyView } from './RegionalReferralApplyView';
import { RegionalReferralReceiveView } from './RegionalReferralReceiveView';
import { RegionalReportCenterView } from './RegionalReportCenterView';

interface RegionalLabWorkstationProps {
  subId: string;
  user: UserProfile;
  triggerAction: (text: string) => void;
  onSelectSubMenu: (subId: string) => void;
}

export const RegionalLabWorkstation: React.FC<RegionalLabWorkstationProps> = ({
  subId,
  user,
  triggerAction,
  onSelectSubMenu,
}) => {
  switch (subId) {
    case 'regional-mapping':
      return <RegionalMappingView user={user} triggerAction={triggerAction} />;
    case 'regional-referral-apply':
      return <RegionalReferralApplyView user={user} triggerAction={triggerAction} />;
    case 'regional-referral-receive':
      return <RegionalReferralReceiveView user={user} triggerAction={triggerAction} />;
    case 'regional-report-center':
      return <RegionalReportCenterView user={user} triggerAction={triggerAction} />;
    default:
      return <RegionalMappingView user={user} triggerAction={triggerAction} />;
  }
};
