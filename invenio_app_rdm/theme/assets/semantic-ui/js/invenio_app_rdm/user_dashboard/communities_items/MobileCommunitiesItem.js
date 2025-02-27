// This file is part of InvenioRDM
// Copyright (C) 2022 CERN.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@translations/invenio_app_rdm/i18next";
import React from "react";
import { Image } from "react-invenio-forms";
import { Button, Icon, Item, Label } from "semantic-ui-react";
import PropTypes from "prop-types";

export const MobileCommunitiesItem = ({ result, index }) => {
  const communityType = result.ui?.type?.title_l10n;
  const visibility = result.access.visibility;
  const isPublic = visibility === "public";
  const visibilityColor = isPublic ? "positive" : "negative";
  const visibilityText = isPublic ? i18next.t("Public") : i18next.t("Restricted");
  const visibilityIcon = isPublic ? undefined : "ban";
  return (
    <Item key={index} className="mobile only">
      <Item.Content className="centered">
        <Item.Extra className="user-communities">
          {communityType && (
            <Label size="tiny" className="primary">
              <Icon name="tag" />
              {communityType}
            </Label>
          )}
          <Label size="tiny" className={visibilityColor}>
            {visibilityIcon && <Icon name={visibilityIcon} />}
            {visibilityText}
          </Label>
        </Item.Extra>
        <Item.Extra>
          <Image wrapped src={result.links.logo} size="small" />
        </Item.Extra>
        <Item.Header as="h2">
          <a href={`/communities/${result.id}`}>{result.metadata.title}</a>
        </Item.Header>
        <Item.Meta>
          <div
            className="truncate-lines-2"
            dangerouslySetInnerHTML={{
              __html: result.metadata.description,
            }}
          />
        </Item.Meta>
        <Item>
          {result.metadata.website && (
            <a href={result.metadata.website} target="_blank" rel="noopener noreferrer">
              {result.metadata.website}
            </a>
          )}
        </Item>
        <Item.Extra>
          <Button
            compact
            size="small"
            floated="right"
            href={`/communities/${result.id}/settings`}
            className="fluid-responsive"
          >
            <Icon name="edit" />
            {i18next.t("Edit")}
          </Button>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

MobileCommunitiesItem.propTypes = {
  result: PropTypes.object.isRequired,
  index: PropTypes.string,
};

MobileCommunitiesItem.defaultProps = {
  index: null,
};
