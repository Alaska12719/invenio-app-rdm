// This file is part of InvenioRDM
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
// Copyright (C) 2021-2022 New York University.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import {
  SearchBar,
  MultipleOptionsSearchBarRSK,
} from "@js/invenio_search_ui/components";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import _get from "lodash/get";
import _truncate from "lodash/truncate";
import React, { useState } from "react";
import Overridable from "react-overridable";
import { BucketAggregation, Toggle, withState } from "react-searchkit";
import {
  Accordion,
  Button,
  Card,
  Checkbox,
  Grid,
  Header,
  Icon,
  Input,
  Item,
  Label,
  List,
  Message,
  Segment,
} from "semantic-ui-react";
import { SearchItemCreators } from "../utils";
import PropTypes from "prop-types";

export const RDMRecordResultsListItem = ({ result }) => {
  const accessStatusId = _get(result, "ui.access_status.id", "open");
  const accessStatus = _get(result, "ui.access_status.title_l10n", "Open");
  const accessStatusIcon = _get(result, "ui.access_status.icon", "unlock");
  const createdDate = _get(
    result,
    "ui.created_date_l10n_long",
    "No creation date found."
  );
  const creators = result.ui.creators.creators.slice(0, 3);

  const descriptionStripped = _get(result, "ui.description_stripped", "No description");

  const publicationDate = _get(
    result,
    "ui.publication_date_l10n_long",
    "No publication date found."
  );
  const resourceType = _get(result, "ui.resource_type.title_l10n", "No resource type");
  const subjects = _get(result, "ui.subjects", []);
  const title = _get(result, "metadata.title", "No title");
  const version = _get(result, "ui.version", null);

  // Derivatives
  const viewLink = `/records/${result.id}`;
  return (
    <Item>
      <Item.Content>
        <Item.Extra className="labels-actions">
          <Label size="tiny" className="primary">
            {publicationDate} ({version})
          </Label>
          <Label size="tiny" className="neutral">
            {resourceType}
          </Label>
          <Label size="tiny" className={`access-status ${accessStatusId}`}>
            {accessStatusIcon && <i className={`icon ${accessStatusIcon}`} />}
            {accessStatus}
          </Label>
        </Item.Extra>
        <Item.Header as="h2">
          <a href={viewLink}>{title}</a>
        </Item.Header>
        <Item className="creatibutors">
          <SearchItemCreators creators={creators} />
        </Item>
        <Item.Description>
          {_truncate(descriptionStripped, { length: 350 })}
        </Item.Description>
        <Item.Extra>
          {subjects.map((subject) => (
            <Label key={subject.title_l10n} size="tiny">
              {subject.title_l10n}
            </Label>
          ))}
          {createdDate && (
            <div>
              <small>
                {i18next.t("Uploaded on")} <span>{createdDate}</span>
              </small>
            </div>
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

RDMRecordResultsListItem.propTypes = {
  result: PropTypes.object.isRequired,
};

// TODO: Update this according to the full List item template?
export const RDMRecordResultsGridItem = ({ result }) => {
  const descriptionStripped = _get(result, "ui.description_stripped", "No description");
  return (
    <Card fluid href={`/records/${result.pid}`}>
      <Card.Content>
        <Card.Header>{result.metadata.title}</Card.Header>
        <Card.Description>
          {_truncate(descriptionStripped, { length: 200 })}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

RDMRecordResultsGridItem.propTypes = {
  result: PropTypes.object.isRequired,
};

export const RDMRecordSearchBarContainer = () => {
  return (
    <Overridable id="SearchApp.searchbar">
      <SearchBar />
    </Overridable>
  );
};

export const RDMRecordMultipleSearchBarElement = ({ queryString, onInputChange }) => {
  const headerSearchbar = document.getElementById("header-search-bar");
  const searchbarOptions = JSON.parse(headerSearchbar.dataset.options);

  return (
    <MultipleOptionsSearchBarRSK
      options={searchbarOptions}
      onInputChange={onInputChange}
      queryString={queryString}
      placeholder={i18next.t("Search records...")}
    />
  );
};

RDMRecordMultipleSearchBarElement.propTypes = {
  queryString: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export const RDMRecordSearchBarElement = withState(
  ({
    placeholder: passedPlaceholder,
    queryString,
    onInputChange,
    updateQueryState,
    currentQueryState,
  }) => {
    const placeholder = passedPlaceholder || i18next.t("Search");

    const onSearch = () => {
      updateQueryState({ ...currentQueryState, queryString });
    };

    const onBtnSearchClick = () => {
      onSearch();
    };
    const onKeyPress = (event) => {
      if (event.key === "Enter") {
        onSearch();
      }
    };
    return (
      <Input
        action={{
          "icon": "search",
          "onClick": onBtnSearchClick,
          "className": "search",
          "aria-label": "Search",
        }}
        fluid
        placeholder={placeholder}
        onChange={(event, { value }) => {
          onInputChange(value);
        }}
        value={queryString}
        onKeyPress={onKeyPress}
      />
    );
  }
);

export const RDMParentFacetValue = ({
  bucket,
  keyField,
  isSelected,
  childAggCmps,
  onFilterClicked,
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Accordion className="rdm-multi-facet">
      <Accordion.Title
        onClick={() => {}}
        key={`panel-${bucket.label}`}
        active={isActive}
        className="facet-wrapper parent"
      >
        <List.Content className="facet-wrapper">
          <Button
            icon="angle right"
            className="transparent"
            onClick={() => setIsActive(!isActive)}
            aria-label={i18next.t("Show all sub facets of ") + bucket.label || keyField}
          />
          <Checkbox
            label={bucket.label || keyField}
            id={`${keyField}-facet-checkbox`}
            aria-describedby={`${keyField}-count`}
            value={keyField}
            checked={isSelected}
            onClick={() => onFilterClicked(keyField)}
          />
          <Label circular id={`${keyField}-count`} className="facet-count">
            {bucket.doc_count}
          </Label>
        </List.Content>
      </Accordion.Title>
      <Accordion.Content active={isActive}>{childAggCmps}</Accordion.Content>
    </Accordion>
  );
};

RDMParentFacetValue.propTypes = {
  bucket: PropTypes.object.isRequired,
  keyField: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  childAggCmps: PropTypes.node.isRequired,
  onFilterClicked: PropTypes.func.isRequired,
};

export const RDMFacetValue = ({ bucket, keyField, isSelected, onFilterClicked }) => {
  return (
    <List.Content className="facet-wrapper">
      <Checkbox
        onClick={() => onFilterClicked(keyField)}
        label={bucket.label || keyField}
        id={`${keyField}-facet-checkbox`}
        aria-describedby={`${keyField}-count`}
        value={keyField}
        checked={isSelected}
      />
      <Label circular id={`${keyField}-count`} className="facet-count">
        {bucket.doc_count}
      </Label>
    </List.Content>
  );
};

RDMFacetValue.propTypes = {
  bucket: PropTypes.object.isRequired,
  keyField: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onFilterClicked: PropTypes.func.isRequired,
};

export const RDMRecordFacetsValues = ({
  bucket,
  isSelected,
  onFilterClicked,
  childAggCmps,
}) => {
  const hasChildren = childAggCmps && childAggCmps.props.buckets.length > 0;
  const keyField = bucket.key_as_string ? bucket.key_as_string : bucket.key;
  return (
    <List.Item key={bucket.key}>
      {hasChildren ? (
        <RDMParentFacetValue
          bucket={bucket}
          keyField={keyField}
          isSelected={isSelected}
          childAggCmps={childAggCmps}
          onFilterClicked={onFilterClicked}
        />
      ) : (
        <RDMFacetValue
          bucket={bucket}
          keyField={keyField}
          isSelected={isSelected}
          onFilterClicked={onFilterClicked}
        />
      )}
    </List.Item>
  );
};

RDMRecordFacetsValues.propTypes = {
  bucket: PropTypes.object.isRequired,
  childAggCmps: PropTypes.node,
  isSelected: PropTypes.bool.isRequired,
  onFilterClicked: PropTypes.func.isRequired,
};

RDMRecordFacetsValues.defaultProps = {
  childAggCmps: null,
};

export const SearchHelpLinks = () => {
  return (
    <Overridable id="RdmSearch.SearchHelpLinks">
      <List>
        <List.Item>
          <a href="/help/search">{i18next.t("Search guide")}</a>
        </List.Item>
      </List>
    </Overridable>
  );
};

export const RDMRecordFacets = ({ aggs }) => {
  return (
    <aside aria-label={i18next.t("filters")} id="search-filters">
      <Toggle
        title={i18next.t("Versions")}
        label={i18next.t("View all versions")}
        filterValue={["allversions", "true"]}
      />
      {aggs.map((agg) => {
        return (
          <div className="rdm-facet-container" key={agg.title}>
            <BucketAggregation title={agg.title} agg={agg} />
          </div>
        );
      })}
      <Card className="borderless facet mt-0">
        <Card.Content>
          <Card.Header as="h2">{i18next.t("Help")}</Card.Header>
          <SearchHelpLinks />
        </Card.Content>
      </Card>
    </aside>
  );
};

RDMRecordFacets.propTypes = {
  aggs: PropTypes.array.isRequired,
};

export const RDMBucketAggregationElement = ({
  agg,
  title,
  containerCmp,
  updateQueryFilters,
}) => {
  const clearFacets = () => {
    if (containerCmp.props.selectedFilters.length) {
      updateQueryFilters([agg.aggName, ""], containerCmp.props.selectedFilters);
    }
  };

  const hasSelections = () => {
    return !!containerCmp.props.selectedFilters.length;
  };

  return (
    <Card className="borderless facet">
      <Card.Content>
        <Card.Header as="h2">
          {title}

          {hasSelections() && (
            <Button
              basic
              icon
              size="mini"
              floated="right"
              onClick={clearFacets}
              aria-label={i18next.t("Clear selection")}
              title={i18next.t("Clear selection")}
            >
              {i18next.t("Clear")}
            </Button>
          )}
        </Card.Header>
        {containerCmp}
      </Card.Content>
    </Card>
  );
};

RDMBucketAggregationElement.propTypes = {
  agg: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  containerCmp: PropTypes.node,
  updateQueryFilters: PropTypes.func.isRequired,
};

RDMBucketAggregationElement.defaultProps = {
  containerCmp: null,
};

export const RDMToggleComponent = ({
  updateQueryFilters,
  userSelectionFilters,
  filterValue,
  label,
  title,
}) => {
  const _isChecked = (userSelectionFilters) => {
    const isFilterActive =
      userSelectionFilters.filter((filter) => filter[0] === filterValue[0]).length > 0;
    return isFilterActive;
  };

  const onToggleClicked = () => {
    updateQueryFilters(filterValue);
  };

  var isChecked = _isChecked(userSelectionFilters);
  return (
    <Card className="borderless facet">
      <Card.Content>
        <Card.Header as="h2">{title}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Checkbox
          toggle
          label={label}
          name="versions-toggle"
          id="versions-toggle"
          onClick={onToggleClicked}
          checked={isChecked}
        />
      </Card.Content>
    </Card>
  );
};

RDMToggleComponent.propTypes = {
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  filterValue: PropTypes.array.isRequired,
  userSelectionFilters: PropTypes.array.isRequired,
  updateQueryFilters: PropTypes.func.isRequired,
};

export const RDMCountComponent = ({ totalResults }) => {
  return <Label>{totalResults.toLocaleString("en-US")}</Label>;
};

RDMCountComponent.propTypes = {
  totalResults: PropTypes.number.isRequired,
};

export const RDMEmptyResults = ({ queryString, searchPath, resetQuery }) => {
  return (
    <Grid>
      <Grid.Row centered>
        <Grid.Column width={12} textAlign="center">
          <Header as="h2">
            {i18next.t("We couldn't find any matches for ")}
            {(queryString && `'${queryString}'`) || i18next.t("your search")}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered>
        <Grid.Column width={8} textAlign="center">
          <Button primary onClick={resetQuery}>
            <Icon name="search" />
            {i18next.t("Start over")}
          </Button>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered>
        <Grid.Column width={12}>
          <Segment secondary padded size="large">
            <Header as="h3" size="small">
              {i18next.t("ProTip")}!
            </Header>
            <p>
              <a href={`${searchPath}?q=metadata.publication_date:[2017-01-01 TO *]`}>
                metadata.publication_date:[2017-01-01 TO *]
              </a>{" "}
              {i18next.t("will give you all the publications from 2017 until today.")}
            </p>
            <p>
              {i18next.t("For more tips, check out our ")}
              <a href="/help/search" title={i18next.t("Search guide")}>
                {i18next.t("search guide")}
              </a>
              {i18next.t(" for defining advanced search queries.")}
            </p>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

RDMEmptyResults.propTypes = {
  queryString: PropTypes.string.isRequired,
  resetQuery: PropTypes.func.isRequired,
  searchPath: PropTypes.string,
};

RDMEmptyResults.defaultProps = {
  searchPath: "/search",
};

export const RDMErrorComponent = ({ error }) => {
  return (
    <Message warning>
      <Message.Header>
        <Icon name="warning sign" />
        {error.response.data.message}
      </Message.Header>
    </Message>
  );
};

RDMErrorComponent.propTypes = {
  error: PropTypes.object.isRequired,
};
